import {
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
import { CreatePedidoDto, UpdatePedidoDto } from './dto';
import type { GetPedidosResponse, PedidoInterface } from './interfaces';
import { PaginationDto, SearchWithPaginationDto } from '../common/dtos';
import { CreateRemitoDto } from '../remitos/dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { VENDEDOR_INFO } from '../remitos/constants/vendedor-info.constant';

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
    const { ...rest } = createPedidoDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Crear la instancia
      const nuevoPedido = queryRunner.manager.create(Pedido, {
        ...rest,
        usuario: { usuario_id: usuarioId },
      });

      // Guardar el pedido
      const savedPedido = await queryRunner.manager.save(Pedido, nuevoPedido);

      // Obtener info del usuario
      const comprador_info = await this.usuariosService.findOne(usuarioId);

      // Obtener el pedido_id del pedido recién creado
      const pedidoId = savedPedido.pedido_id;

      // Crear el remito utilizando el servicio de remitos
      const remitoDto: CreateRemitoDto = {
        pedido_id: pedidoId,
        nombre_comprador: `${comprador_info.nombre}  ${comprador_info.apellido}`,
        domicilio_comprador: comprador_info.dom_fiscal,
        dni_comprador: comprador_info.dni,
        nombre_vendedor: VENDEDOR_INFO.nombre,
        domicilio_vendedor: VENDEDOR_INFO.domicilio,
        dni_vendedor: VENDEDOR_INFO.dni,
        total_precio: rest.total_precio,
      };

      // Guardar el remito, utilizando el pedido_id recién creado
      const nuevoRemito = queryRunner.manager.create(Remito, {
        ...remitoDto,
        pedido: savedPedido, // Relacionar el pedido directamente con el remito
      });
      await queryRunner.manager.save(Remito, nuevoRemito);

      // Confirmar la transacción
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
  ): Promise<Partial<Pedido>> {
    const { ...toUpdate } = updatePedidoDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const pedido = await this.findOne(id);

      // Combinar las propiedades del DTO con la entidad existente
      this.pedidoRepository.merge(pedido, toUpdate);

      // Guardar el pedido con las actualizaciones
      await queryRunner.manager.save(pedido);

      // Confirmar la transacción si todo salió bien
      await queryRunner.commitTransaction();

      return pedido;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al actualizar el pedido con ID ${id}.`,
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
