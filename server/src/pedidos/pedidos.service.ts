import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, Raw, Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { Remito } from '../remitos/entities/remito.entity';
import { Producto } from '../productos/entities/producto.entity';
import { DetallesPedido } from '../detalles_pedidos/entities/detalles_pedido.entity';
import { CreatePedidoDto, UpdatePedidoDto } from './dto';
import type { GetPedidosResponse, PedidoInterface } from './interfaces';
import { PaginationDto, SearchWithPaginationDto } from '../common/dtos';
import { CreateRemitoDto } from '../remitos/dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { MailsService } from '../mails/mails.service';
import { VENDEDOR_INFO } from '../remitos/constants/vendedor-info.constant';
import { EstadoPedido } from './types/estado-pedido.enum';
import { NotificacionesService } from 'src/notificaciones/notificaciones.service';
import { TipoNotificacion } from 'src/notificaciones/entities/notificacion.entity';

@Injectable()
export class PedidosService {
  private readonly logger = new Logger('PedidoService');

  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
    @InjectRepository(DetallesPedido)
    private readonly detallePedidosRepository: Repository<DetallesPedido>,
    private readonly usuariosService: UsuariosService,
    private readonly mailsService: MailsService,
    private readonly dataSource: DataSource,
    private readonly notificacionesService: NotificacionesService
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
        nombre_comercio_comprador: comprador_info.nombre_comercio,
        domicilio_comprador: comprador_info.dom_fiscal,
        dni_comprador: comprador_info.dni,
        nombre_vendedor: VENDEDOR_INFO.nombre,
        domicilio_vendedor: VENDEDOR_INFO.domicilio,
        dni_vendedor: VENDEDOR_INFO.cuit,
        total_precio: savedPedido.total_precio, // Utilizo el total_precio calculado
      };

      const nuevoRemito = queryRunner.manager.create(Remito, {
        ...remitoDto,
        pedido: savedPedido, // Relacionar el pedido directamente con el remito
      });

      await queryRunner.manager.save(Remito, nuevoRemito);

      // 5. Confirmar la transacción
      await queryRunner.commitTransaction();

      try {
        // Enviar correo de notificación al admin
        await this.mailsService.sendNotificationNewOrder();
      } catch (error) {
        this.logger.warn('Error al enviar la notificación por correo:', error);
      }

      try {
        await this.notificacionesService.createNotification(TipoNotificacion.PEDIDO)
      } catch (error) {
        this.logger.warn('Error al crear una notificación de pedido:', error);
      }

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
  async createPedidoAdmin(
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
        nombre_comercio_comprador: comprador_info.nombre_comercio,
        domicilio_comprador: comprador_info.dom_fiscal,
        dni_comprador: comprador_info.dni,
        nombre_vendedor: VENDEDOR_INFO.nombre,
        domicilio_vendedor: VENDEDOR_INFO.domicilio,
        dni_vendedor: VENDEDOR_INFO.cuit,
        total_precio: savedPedido.total_precio, // Utilizo el total_precio calculado
      };

      const nuevoRemito = queryRunner.manager.create(Remito, {
        ...remitoDto,
        pedido: savedPedido, // Relacionar el pedido directamente con el remito
      });

      await queryRunner.manager.save(Remito, nuevoRemito);

      // 5. Confirmar la transacción
      await queryRunner.commitTransaction();

      // try {
      //   // Enviar correo de notificación al admin
      //   await this.mailsService.sendNotificationNewOrder();
      // } catch (error) {
      //   this.logger.warn('Error al enviar la notificación por correo:', error);
      // }

      try {
        await this.notificacionesService.createNotification(TipoNotificacion.PEDIDO)
      } catch (error) {
        this.logger.warn('Error al crear una notificación de pedido:', error);
      }

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
        order: {
          fecha_pedido: 'DESC',
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

  async findPedidosByEstado(
    estado_pedido: EstadoPedido,
    paginationDto: PaginationDto,
  ) {
    const { limit = 10, offset = 0 } = paginationDto;

    try {
      const [pedidos, total] = await this.pedidoRepository.findAndCount({
        where: { esta_activo: true, estado_pedido },
        relations: {
          usuario: true,
        },
        select: {
          usuario: {
            nombre: true,
            apellido: true,
          },
        },
        order: {
          fecha_pedido: 'DESC',
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
        'Error al filtrar los pedidos',
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

        let total = detalleDto.cantidad * detalleDto.precio_unitario;

        if (detalleDto.descuento) {
          total = total * (1 - detalleDto.descuento / 100);
        }

        const nuevoDetallePedido = queryRunner.manager.create(DetallesPedido, {
          cantidad: detalleDto.cantidad,
          precio_unitario: detalleDto.precio_unitario,
          descuento: detalleDto.descuento || 0,
          total_precio: total,
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
      const remitoExistente = await queryRunner.manager.findOne(Remito, {
        where: { pedido: { pedido_id: id } },
      });

      if (remitoExistente) {
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

  async updateEstado(
    id: string,
    nuevoEstado: EstadoPedido,
  ): Promise<PedidoInterface> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Obtener el pedido existente
      const pedido = await this.findOne(id);

      if (!pedido) {
        throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
      }

      // 2. Validar el nuevo estado
      if (!Object.values(EstadoPedido).includes(nuevoEstado)) {
        throw new BadRequestException(`Estado ${nuevoEstado} no es válido`);
      }

      // 3. Actualizar el estado del pedido
      pedido.estado_pedido = nuevoEstado;
      await queryRunner.manager.save(Pedido, pedido);

      // 4. Confirmar la transacción
      await queryRunner.commitTransaction();

      return pedido;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al actualizar el estado del pedido',
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

  async obtenerGananciasPorDia(): Promise<{ labels: string[]; data: number[] }> {
    const hoy = new Date();

    const primerDiaSemana = new Date(hoy);
    primerDiaSemana.setDate(hoy.getDate() - hoy.getDay()); // Domingo

    const ultimoDiaSemana = new Date(hoy);
    ultimoDiaSemana.setDate(hoy.getDate() + (6 - hoy.getDay())); // Sábado

    const pedidos = await this.pedidoRepository.find({
      where: {
        esta_activo: true,
        estado_pedido: Raw(alias => `${alias} IN ('aprobado', 'enviado')`),
        fecha_pedido: Between(primerDiaSemana, ultimoDiaSemana),
      },
    });

    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const grouped: Record<string, number> = {};

    dias.forEach(dia => {
      grouped[dia] = 0;
    });

    pedidos.forEach(pedido => {
      const dia = new Date(pedido.fecha_pedido).getDay();
      const nombreDia = dias[dia];

      let ganancia: any = pedido.total_precio;

      if (typeof ganancia === 'string') {
        ganancia = ganancia
          .split('.')
          .map(num => parseFloat(num))
          .reduce((acc, num) => acc + num, 0);
      } else {
        ganancia = parseFloat(ganancia);
      }

      grouped[nombreDia] += ganancia;
    });

    return {
      labels: dias,
      data: dias.map(d => grouped[d])
    };
  }

  async obtenerGananciasPorSemana(): Promise<{ semana: string; ganancia: number }[]> {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    const pedidos = await this.pedidoRepository.find({
      where: {
        esta_activo: true,
        estado_pedido: Raw(alias => `${alias} IN ('aprobado', 'enviado')`),
        fecha_pedido: Between(primerDiaMes, ultimoDiaMes),
      },
    });

    const grouped: { [key: string]: number } = {};

    pedidos.forEach(pedido => {
      const fecha = new Date(pedido.fecha_pedido);
      const dia = fecha.getDate();
      const semana = Math.ceil(dia / 7); // Semana 1, 2, 3, 4, 5

      const nombreSemana = `Semana ${semana}`;

      const ganancia = typeof pedido.total_precio === 'number'
      ? pedido.total_precio
      : parseFloat(pedido.total_precio);

      grouped[nombreSemana] = (grouped[nombreSemana] || 0) + ganancia;
    });

    // Aseguramos que existan todas las semanas del mes
    const semanasDelMes = Array.from({ length: 5 }, (_, i) => `Semana ${i + 1}`);
    return semanasDelMes.map(semana => ({
      semana,
      ganancia: grouped[semana] || 0,
    }));
  }

  async obtenerTotalProductosVendidos(rango: "week" | "month"): Promise<number> {
    const hoy = new Date();
    let fechaInicio;
    let fechaFin;

    if (rango === "week") {
      // Semana actual: de domingo a sábado
      fechaInicio = new Date(hoy);
      fechaInicio.setDate(hoy.getDate() - hoy.getDay());
      fechaInicio.setHours(0, 0, 0, 0);

      fechaFin = new Date(hoy);
      fechaFin.setDate(hoy.getDate() + (6 - hoy.getDay()));
      fechaFin.setHours(23, 59, 59, 999);
    } else if (rango === "month") {
      // Mes actual: desde el primer día hasta el último del mes
      fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      fechaInicio.setHours(0, 0, 0, 0);

      fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
      fechaFin.setHours(23, 59, 59, 999);
    } else {
      throw new Error("Rango inválido. Usa 'week' o 'month'.");
    }

    const pedidos = await this.pedidoRepository.find({
      where: {
        esta_activo: true,
        estado_pedido: Raw(alias => `${alias} IN ('aprobado', 'enviado')`),
        fecha_pedido: Between(fechaInicio, fechaFin),
      },
      relations: {
        detalles_pedido: true
      },
    });

    // Sumar la cantidad de cada producto vendido en todos los pedidos encontrados
    const totalProductosVendidos = pedidos.reduce((totalPedido, pedido) => {
      // Si por alguna razón detalles_pedido no existe, consideramos 0
      const totalPorPedido = pedido.detalles_pedido
        ? pedido.detalles_pedido.reduce((totalDetalle, detalle) => totalDetalle + detalle.cantidad, 0)
        : 0;
      return totalPedido + totalPorPedido;
    }, 0);

    return totalProductosVendidos;
  }
}
