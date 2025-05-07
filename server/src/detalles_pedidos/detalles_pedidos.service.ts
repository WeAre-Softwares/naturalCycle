import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, In, Repository } from 'typeorm';
import { DetallesPedido } from './entities/detalles_pedido.entity';
import type { GetDetallesPedidosResponse } from './interfaces';
import { PaginationDto } from '../common/dtos';
import { EstadoPedido } from 'src/pedidos/types/estado-pedido.enum';

@Injectable()
export class DetallesPedidosService {
  private readonly logger = new Logger('DetallePedidoService');

  constructor(
    @InjectRepository(DetallesPedido)
    private readonly detallePedidoRepository: Repository<DetallesPedido>,
    private readonly dataSource: DataSource,
  ) {}

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

  async findByPedidoId(pedidoId: string): Promise<DetallesPedido[]> {
    try {
      return this.detallePedidoRepository.find({
        where: { pedido: { pedido_id: pedidoId }, esta_activo: true },
        relations: {
          producto: true,
          pedido: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error al buscar el detalle pedido',
        error,
      );
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

  async obtenerTopCategoriasEnVentas(range: 'week' | 'month'){
    const hoy = new Date();
    let fechaInicio = new Date();
    let fechaFin = new Date();
    
    if (range === 'week') {
      const diaSemana = hoy.getDay(); // 0 (domingo) - 6 (sábado)
      fechaInicio.setDate(hoy.getDate() - diaSemana); // domingo
      fechaInicio.setHours(0, 0, 0, 0);
    
      fechaFin.setDate(fechaInicio.getDate() + 6); // sábado
      fechaFin.setHours(23, 59, 59, 999);
    } else if (range === 'month') {
      fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1); // día 1 del mes
      fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0); // último día del mes
      fechaFin.setHours(23, 59, 59, 999);
    }
  
    const detalles = await this.detallePedidoRepository.find({
      where: {
        esta_activo: true,
        pedido: {
          esta_activo: true,
          estado_pedido: In([EstadoPedido.aprobado, EstadoPedido.enviado]),
          fecha_pedido: Between(fechaInicio, hoy),
        },
      },
      relations: [
        'producto',
        'producto.productosCategorias',
        'producto.productosCategorias.categoria',
        'pedido',
      ],
    });
  
    const categoriasCantidadMap = new Map<string, number>();
    const productosPorCategoria = new Map<string, Map<string, { cantidad: number; ganancia: number }>>();
  
    for (const detalle of detalles) {
      const categorias = detalle.producto.productosCategorias || [];
      const productoId = detalle.producto.producto_id;
      const cantidad = detalle.cantidad;
      const ganancia = parseFloat(detalle.total_precio.toString());
  
      for (const cat of categorias) {
        const nombre = cat.categoria.nombre;
  
        categoriasCantidadMap.set(nombre, (categoriasCantidadMap.get(nombre) || 0) + cantidad);
  
        if (!productosPorCategoria.has(nombre)) {
          productosPorCategoria.set(nombre, new Map());
        }
  
        const productosMap = productosPorCategoria.get(nombre)!;
        if (!productosMap.has(productoId)) {
          productosMap.set(productoId, { cantidad: 0, ganancia: 0 });
        }
  
        const data = productosMap.get(productoId)!;
        data.cantidad += cantidad;
        data.ganancia += ganancia;
      }
    }
  
    const topCategorias = [...categoriasCantidadMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([nombre]) => nombre);
  
    const resultado = [];
  
    for (const categoria of topCategorias) {
      const productosMap = productosPorCategoria.get(categoria)!;
  
      let maxCantidad = 0;
      let gananciaProductoTop = 0;
  
      for (const { cantidad, ganancia } of productosMap.values()) {
        if (cantidad > maxCantidad) {
          maxCantidad = cantidad;
          gananciaProductoTop = ganancia;
        }
      }
  
      resultado.push({
        categoria,
        ganancia: parseFloat(gananciaProductoTop.toFixed(2)),
      });
    }
  
    return resultado;
  }

  async obtenerTopCategoriasEnVentasPorProducto(
    range: 'week' | 'month',
  ) {
    const hoy = new Date();
    let fechaInicio = new Date();
    let fechaFin = new Date();
    
    if (range === 'week') {
      const diaSemana = hoy.getDay(); // 0 (domingo) - 6 (sábado)
      fechaInicio.setDate(hoy.getDate() - diaSemana); // domingo
      fechaInicio.setHours(0, 0, 0, 0);
    
      fechaFin.setDate(fechaInicio.getDate() + 6); // sábado
      fechaFin.setHours(23, 59, 59, 999);
    } else if (range === 'month') {
      fechaInicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1); // día 1 del mes
      fechaFin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0); // último día del mes
      fechaFin.setHours(23, 59, 59, 999);
    }

    const detalles = await this.detallePedidoRepository.find({
      where: {
        esta_activo: true,
        pedido: {
          esta_activo: true,
          estado_pedido: In([EstadoPedido.aprobado, EstadoPedido.enviado]),
          fecha_pedido: Between(fechaInicio, hoy),
        },
      },
      relations: [
        'producto',
        'producto.productosCategorias',
        'producto.productosCategorias.categoria',
        'pedido',
      ],
    });

    // Agrupar cantidades por categoría
    const categoriasMap = new Map<string, number>();

    for (const detalle of detalles) {
      const categorias = detalle.producto.productosCategorias || [];

      for (const cat of categorias) {
        const nombre = cat.categoria.nombre;
        const actual = categoriasMap.get(nombre) || 0;
        categoriasMap.set(nombre, actual + detalle.cantidad);
      }
    }

    // Convertir a array, ordenar y limitar a 4
    const categoriasOrdenadas = [...categoriasMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    // Preparar datos para Chart.js
    const response = {
      categoria: categoriasOrdenadas.map(([nombre]) => nombre),
      cantidad: categoriasOrdenadas.map(([_, cantidad]) => cantidad),
    };

    return response;
  }
}
