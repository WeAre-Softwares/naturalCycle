import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DetallesPedido } from './entities/detalles_pedido.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { CreateDetallesPedidoDto, UpdateDetallesPedidoDto } from './dto';
import type { GetDetallesPedidosResponse } from './interfaces';
import { PaginationDto } from '../common/dtos';

@Injectable()
export class DetallesPedidosService {
  private readonly logger = new Logger('DetallePedidoService');

  constructor(
    @InjectRepository(DetallesPedido)
    private readonly detallePedidoRepository: Repository<DetallesPedido>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createDetallesPedidoDto: CreateDetallesPedidoDto) {
    const { producto_id, pedido_id, ...rest } = createDetallesPedidoDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Busca las entidades relacionadas
      const producto = await queryRunner.manager.findOne(Producto, {
        where: { producto_id },
      });
      const pedido = await queryRunner.manager.findOne(Pedido, {
        where: { pedido_id },
      });

      // Crear la instancia
      const nuevoDetallePedido = queryRunner.manager.create(DetallesPedido, {
        ...rest,
        producto,
        pedido,
      });

      // Guardar el pedido
      await queryRunner.manager.save(nuevoDetallePedido);

      // Confirmar la transacción
      await queryRunner.commitTransaction();

      // Todo: aplanar resultado
      return nuevoDetallePedido;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(error);
      console.log(error);
      throw new InternalServerErrorException(
        'Error al crear el detalle pedido',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<GetDetallesPedidosResponse> {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const [detalles_pedidos, total] =
        await this.detallePedidoRepository.findAndCount({
          where: { esta_activo: true },
          relations: {
            producto: true,
            pedido: true,
          },
          select: {
            producto: {
              nombre: true,
              descripcion: true,
              precio: true,
            },
            pedido: {
              estado_pedido: true,
              fecha_pedido: true,
              total_precio: true,
            },
          },
          take: limit,
          skip: offset,
        });

      return {
        detalles_pedidos,
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

  async findOne(id: string): Promise<DetallesPedido> {
    try {
      const detalle_pedido = await this.detallePedidoRepository.findOne({
        where: { detalles_pedidos_id: id, esta_activo: true },
        relations: {
          producto: true,
          pedido: true,
        },
        select: {
          producto: {
            nombre: true,
            descripcion: true,
            precio: true,
          },
          pedido: {
            estado_pedido: true,
            fecha_pedido: true,
            total_precio: true,
          },
        },
      });

      if (!detalle_pedido) {
        throw new NotFoundException(
          `No se encontro el detalle pedido con el id: ${id}`,
        );
      }

      return detalle_pedido;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar el detalle pedido',
        error,
      );
    }
  }

  async findOneByPedidoId(pedidoId: string): Promise<DetallesPedido> {
    try {
      return this.detallePedidoRepository.findOne({
        where: { pedido: { pedido_id: pedidoId }, esta_activo: true },
        relations: { producto: true },
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar el detalle pedido',
        error,
      );
    }
  }

  async update(
    id: string,
    updateDetallesPedidoDto: UpdateDetallesPedidoDto,
  ): Promise<Partial<DetallesPedido>> {
    const { producto_id, pedido_id, ...toUpdate } = updateDetallesPedidoDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const detalle_pedido = await this.findOne(id);

      // Si se proporciona un nuevo producto_id, buscar el producto relacionado
      if (producto_id) {
        const producto = await queryRunner.manager.findOne(Producto, {
          where: { producto_id },
        });

        detalle_pedido.producto = producto; // Asignar el nuevo producto
      }

      // Si se proporciona un nuevo pedido_id, buscar el pedido relacionado
      if (pedido_id) {
        const pedido = await queryRunner.manager.findOne(Pedido, {
          where: { pedido_id },
        });

        detalle_pedido.pedido = pedido; // Asignar el nuevo pedido
      }

      // Combinar las propiedades del DTO con la entidad existente
      this.detallePedidoRepository.merge(detalle_pedido, toUpdate);

      // Guardar el detalle pedido con las actualizaciones
      await queryRunner.manager.save(detalle_pedido);

      // Confirmar la transacción si todo salió bien
      await queryRunner.commitTransaction();

      //Todo: aplanar resultado
      return detalle_pedido;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al actualizar el detalle pedido con ID ${id}.`,
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
      const detalle_pedido = await this.findOne(id);

      // Marcar como inactivo
      detalle_pedido.esta_activo = false;
      // Guardar en la DB
      await this.detallePedidoRepository.save(detalle_pedido);
      return {
        mensaje: `El detalle pedido con ID ${id} ha sido marcado como inactivo.`,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al marcar como inactivo el detalle pedido con ID ${id}.`,
        error,
      );
    }
  }

  async activate(id: string): Promise<{
    mensaje: string;
  }> {
    try {
      const detalle_pedido = await this.detallePedidoRepository.findOne({
        where: { detalles_pedidos_id: id },
      });

      if (!detalle_pedido) {
        throw new NotFoundException(
          `No se encontro el detalle pedido con el id: ${id}`,
        );
      }

      // Marcar como activo
      detalle_pedido.esta_activo = true;
      // Guardar en la DB
      await this.detallePedidoRepository.save(detalle_pedido);
      return {
        mensaje: `El detalle pedido con ID ${id} ha sido marcado como activo.`,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al marcar como activo el detalle pedido con ID ${id}.`,
        error,
      );
    }
  }
}
