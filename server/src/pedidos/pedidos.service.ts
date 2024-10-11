import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { CreatePedidoDto, UpdatePedidoDto } from './dto';
import type { GetPedidosResponse, PedidoInterface } from './interfaces';
import { PaginationDto, SearchWithPaginationDto } from '../common/dtos';

@Injectable()
export class PedidosService {
  private readonly logger = new Logger('PedidoService');

  constructor(
    @InjectRepository(Pedido)
    private readonly pedidoRepository: Repository<Pedido>,
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
      await queryRunner.manager.save(nuevoPedido);

      // Confirmar la transacción
      await queryRunner.commitTransaction();

      return nuevoPedido;
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
        .select([
          'pedidos.pedido_id',
          'pedidos.estado_pedido',
          'pedidos.total_precio',
          'pedidos.fecha_pedido',
          'pedidos.fecha_actualizacion',
        ])
        .where('pedidos.esta_activo = :esta_activo', { esta_activo: true })
        .andWhere('(LOWER(pedidos.estado_pedido::text) LIKE LOWER(:term))', {
          term: `%${term}%`,
        })
        .take(limit)
        .skip(offset);

      // Verificar la consulta generada
      console.log('SQL generada:', queryBuilder.getSql());
      console.log('Término de búsqueda aplicado:', term);

      const pedidos = await queryBuilder.getMany();

      // Aplanar los resultados
      const listaPedidosAplanados = pedidos.map((pedido) => ({
        id: pedido.pedido_id,
        estado_pedido: pedido.estado_pedido,
        total_precio: pedido.total_precio,
        fecha_pedido: pedido.fecha_pedido,
        fecha_actualizacion: pedido.fecha_actualizacion,
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

      // Marcar como activa la marca
      pedido.esta_activo = true;
      // Guardar en la DB
      await this.pedidoRepository.save(pedido);
      return {
        mensaje: `La marca con ID ${id} ha sido marcada como activa.`,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error al marcar como activa la marca con ID ${id}.`,
        error,
      );
    }
  }
}
