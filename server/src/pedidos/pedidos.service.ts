import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { Remito } from '../remitos/entities/remito.entity';
import { Producto } from '../productos/entities/producto.entity';
import { DetallesPedido } from '../detalles_pedidos/entities/detalles_pedido.entity';
import { CreatePedidoDto, UpdatePedidoDto } from './dto';
import type { GetPedidosResponse, PedidoInterface } from './interfaces';
import { PaginationDto, SearchWithPaginationDto } from '../common/dtos';
import { CreateRemitoDto } from '../remitos/dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { VENDEDOR_INFO } from '../remitos/constants/vendedor-info.constant';
import { EstadoPedido } from './types/estado-pedido.enum';

@Injectable()
export class PedidosService {
  private readonly logger = new Logger('PedidoService');

  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    private readonly usuariosService: UsuariosService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createPedidoDto: CreatePedidoDto,
    usuarioId: string,
  ): Promise<PedidoInterface> {
    const { detalles } = createPedidoDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validar que haya detalles en el pedido
      if (!detalles || detalles.length === 0) {
        throw new BadRequestException(
          'El pedido debe contener al menos un detalle',
        );
      }

      // 1. Crear el pedido (sin total_precio aún)
      // Crear la instancia
      const nuevoPedido = queryRunner.manager.create(Pedido, {
        usuario: { usuario_id: usuarioId },
        estado_pedido: EstadoPedido.esperando_aprobacion,
        total_precio: 0, // Asignar 0 para evitar el error de not-null
      });

      // Guardar el pedido
      const savedPedido = await queryRunner.manager.save(Pedido, nuevoPedido);

      let totalPrecio = 0;

      // 2. Crear los detalles del pedido (cada producto)
      for (const detalleDto of createPedidoDto.detalles) {
        const producto = await queryRunner.manager.findOne(Producto, {
          where: { producto_id: detalleDto.producto_id },
        });

        if (!producto) {
          throw new InternalServerErrorException(
            `Producto no encontrado: ${detalleDto.producto_id}`,
          );
        }

        const nuevoDetallePedido = queryRunner.manager.create(DetallesPedido, {
          cantidad: detalleDto.cantidad,
          precio_unitario: detalleDto.precio_unitario,
          total_precio: detalleDto.cantidad * detalleDto.precio_unitario, // Calcular el total de cada detalle
          producto: producto,
          pedido: savedPedido, // Asociar al pedido recién creado
        });

        await queryRunner.manager.save(DetallesPedido, nuevoDetallePedido);

        totalPrecio += nuevoDetallePedido.total_precio; // Sumar al total del pedido
      }

      // Actualizar el total_precio del pedido con el valor calculado
      savedPedido.total_precio = totalPrecio;
      await queryRunner.manager.save(Pedido, savedPedido);

      // 3. Obtener la información del usuario comprador
      const comprador_info = await this.usuariosService.findOne(usuarioId);

      // 4. Crear el remito
      const remitoDto: CreateRemitoDto = {
        pedido_id: savedPedido.pedido_id,
        nombre_comprador: `${comprador_info.nombre}  ${comprador_info.apellido}`,
        domicilio_comprador: comprador_info.dom_fiscal,
        dni_comprador: comprador_info.dni,
        nombre_vendedor: VENDEDOR_INFO.nombre,
        domicilio_vendedor: VENDEDOR_INFO.domicilio,
        dni_vendedor: VENDEDOR_INFO.dni,
        total_precio: savedPedido.total_precio, // Utilizo el total_precio calculado
      };

      const nuevoRemito = queryRunner.manager.create(Remito, {
        ...remitoDto,
        pedido: savedPedido, // Relacionar el pedido directamente con el remito
      });

      await queryRunner.manager.save(Remito, nuevoRemito);

      // 5. Confirmar la transacción
      await queryRunner.commitTransaction();

      return savedPedido;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(error);
      console.log(error);
      throw new InternalServerErrorException('Error al crear el pedido', error);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<GetPedidosResponse> {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const [pedidos, total] = await this.pedidoRepository.findAndCount({
        where: { esta_activo: true },
        relations: {
          usuario: true,
        },
        select: {
          usuario: {
            nombre: true,
            apellido: true,
          },
        },
        take: limit,
        skip: offset,
      });

      return {
        pedidos,
        total,
        limit,
        offset,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar los pedidos',
        error,
      );
    }
  }

  async findOne(id: string): Promise<Pedido> {
    try {
      const pedido = await this.pedidoRepository.findOne({
        where: { pedido_id: id, esta_activo: true },
        relations: {
          usuario: true,
        },
        select: {
          usuario: {
            nombre: true,
            apellido: true,
          },
        },
      });

      if (!pedido) {
        throw new NotFoundException(
          `No se encontro el pedido con el id: ${id}`,
        );
      }

      return pedido;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar el pedido',
        error,
      );
    }
  }

  async findAllByTerm(
    SearchWithPaginationDto: SearchWithPaginationDto,
  ): Promise<Partial<PedidoInterface>[]> {
    const { limit = 10, offset = 0, term } = SearchWithPaginationDto;

    try {
      const queryBuilder = this.pedidoRepository
        .createQueryBuilder('pedidos')
        .leftJoinAndSelect('pedidos.usuario', 'usuario')
        .select([
          'pedidos.pedido_id',
          'pedidos.estado_pedido',
          'pedidos.total_precio',
          'pedidos.fecha_pedido',
          'pedidos.fecha_actualizacion',
          'usuario.nombre',
          'usuario.apellido',
        ])
        .where('pedidos.esta_activo = :esta_activo', { esta_activo: true })
        .andWhere('(LOWER(pedidos.estado_pedido::text) LIKE LOWER(:term))', {
          term: `%${term}%`,
        })
        .take(limit)
        .skip(offset);

      // Verificar la consulta generada
      // console.log('SQL generada:', queryBuilder.getSql());
      // console.log('Término de búsqueda aplicado:', term);

      const pedidos = await queryBuilder.getMany();

      // Aplanar los resultados
      const listaPedidosAplanados = pedidos.map((pedido) => ({
        id: pedido.pedido_id,
        estado_pedido: pedido.estado_pedido,
        total_precio: pedido.total_precio,
        fecha_pedido: pedido.fecha_pedido,
        fecha_actualizacion: pedido.fecha_actualizacion,
        usuario: {
          nombre: pedido.usuario?.nombre,
          apellido: pedido.usuario?.apellido,
        },
      }));

      return listaPedidosAplanados;
    } catch (error) {
      this.logger.error(error);
      console.log(error);
      throw new InternalServerErrorException(
        'Error al buscar los pedidos por termino',
        error,
      );
    }
  }

  async update(
    id: string,
    updatePedidoDto: UpdatePedidoDto,
  ): Promise<PedidoInterface> {
    const { detalles } = updatePedidoDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Obtener el pedido existente
      const pedido = await this.findOne(id);

      // Validar que haya detalles en el pedido
      if (!detalles || detalles.length === 0) {
        throw new BadRequestException(
          'El pedido debe contener al menos un detalle',
        );
      }

      let totalPrecio = 0;

      // 2. Actualizar los detalles del pedido
      // En este punto podrías eliminar los detalles existentes y luego recrearlos,
      // o actualizar los detalles individuales según sea necesario.
      // Aquí optamos por eliminar y volver a crear los detalle

      // Eliminar detalles previos
      await queryRunner.manager.delete(DetallesPedido, {
        pedido: { pedido_id: id },
      });

      // Crear nuevos detalles de pedido
      for (const detalleDto of updatePedidoDto.detalles) {
        const producto = await queryRunner.manager.findOne(Producto, {
          where: { producto_id: detalleDto.producto_id },
        });

        if (!producto) {
          throw new InternalServerErrorException(
            `Producto no encontrado: ${detalleDto.producto_id}`,
          );
        }

        const nuevoDetallePedido = queryRunner.manager.create(DetallesPedido, {
          cantidad: detalleDto.cantidad,
          precio_unitario: detalleDto.precio_unitario,
          total_precio: detalleDto.cantidad * detalleDto.precio_unitario,
          producto: producto,
          pedido: pedido, // Asociar al pedido existente
        });

        await queryRunner.manager.save(DetallesPedido, nuevoDetallePedido);
        totalPrecio += nuevoDetallePedido.total_precio; // Sumar al total del pedido
      }

      // 3. Actualizar los campos del pedido y el precio total
      pedido.total_precio = totalPrecio;
      pedido.estado_pedido =
        updatePedidoDto.estado_pedido || pedido.estado_pedido;
      await queryRunner.manager.save(Pedido, pedido);

      // 4. Si es necesario, actualizar el remito (basado en el pedido original)
      const comprador_info = await this.usuariosService.findOne(
        pedido.usuario.usuario_id,
      );
      const remitoExistente = await queryRunner.manager.findOne(Remito, {
        where: { pedido: { pedido_id: id } },
      });

      if (remitoExistente) {
        remitoExistente.nombre_comprador = `${comprador_info.nombre} ${comprador_info.apellido}`;
        remitoExistente.domicilio_comprador = comprador_info.dom_fiscal;
        remitoExistente.dni_comprador = comprador_info.dni;
        remitoExistente.total_precio = pedido.total_precio;

        await queryRunner.manager.save(Remito, remitoExistente);
      }

      // 5. Confirmar la transacción
      await queryRunner.commitTransaction();

      return pedido;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al actualizar el pedido',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async deactivate(id: string): Promise<{
    mensaje: string;
  }> {
    try {
      const pedido = await this.findOne(id);

      // Marcar como inactivo
      pedido.esta_activo = false;
      // Guardar en la DB
      await this.pedidoRepository.save(pedido);
      return {
        mensaje: `El pedido con ID ${id} ha sido marcado como inactivo.`,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al marcar como inactivo el pedido con ID ${id}.`,
        error,
      );
    }
  }

  async activate(id: string): Promise<{
    mensaje: string;
  }> {
    try {
      const pedido = await this.pedidoRepository.findOne({
        where: { pedido_id: id },
      });

      if (!pedido) {
        throw new NotFoundException(
          `No se encontro el pedido con el id: ${id}`,
        );
      }

      // Marcar como activo
      pedido.esta_activo = true;
      // Guardar en la DB
      await this.pedidoRepository.save(pedido);
      return {
        mensaje: `El pedido con ID ${id} ha sido marcado como activo.`,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al marcar como activo el pedido con ID ${id}.`,
        error,
      );
    }
  }
}
