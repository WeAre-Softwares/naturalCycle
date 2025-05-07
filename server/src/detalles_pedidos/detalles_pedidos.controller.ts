import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DetallesPedidosService } from './detalles_pedidos.service';
import { DetallesPedido } from './entities/detalles_pedido.entity';
import type { GetDetallesPedidosResponse } from './interfaces';
import { PaginationDto } from '../common/dtos';
import { Auth } from '../auth/decorators';

@ApiTags('Detalles_pedidos')
@Controller('detalles-pedidos')
export class DetallesPedidosController {
  constructor(
    private readonly detallesPedidosService: DetallesPedidosService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @Auth('admin', 'empleado')
  @ApiOperation({ summary: 'Buscar todos los detalles pedidos' })
  findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<GetDetallesPedidosResponse> {
    return this.detallesPedidosService.findAll(paginationDto);
  }

  @Get('/productos-mas-vendidos/:range')
  @ApiBearerAuth()
  @Auth('admin', 'empleado')
  @ApiOperation({ summary: 'Obtener los productos mas vendidos' })
  obtenerTopCategoriasEnVentas(@Param('range') range: 'week' | 'month'){
    return this.detallesPedidosService.obtenerTopCategoriasEnVentas(range);
  }

  @Get('/total-productos-vendidos/:range')
  @ApiBearerAuth()
  @Auth('admin')
  @ApiOperation({ summary: 'Obtener el total de productos vendidos' })
  obtenerTotalProductosVendidos(
    @Param('range') range: 'week' | 'month',
  ): Promise<{
    categoria: string[];
    cantidad: number[];
  }> {
    return this.detallesPedidosService.obtenerTopCategoriasEnVentasPorProducto(range);
  }

  @Get(':id')
  @ApiBearerAuth()
  @Auth('admin', 'empleado')
  @ApiOperation({ summary: 'Buscar detalle pedido por id' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<DetallesPedido> {
    return this.detallesPedidosService.findOne(id);
  }

  @Get('pedido/:pedidoId')
  @ApiBearerAuth()
  @Auth('admin', 'empleado')
  @ApiOperation({ summary: 'Buscar detalles del pedido por ID de pedido' })
  async getDetallesByPedidoId(
    @Param('pedidoId', ParseUUIDPipe) pedidoId: string,
  ): Promise<DetallesPedido[]> {
    try {
      const detallesPedido =
        await this.detallesPedidosService.findByPedidoId(pedidoId);

      if (!detallesPedido.length) {
        throw new NotFoundException(
          `No se encontraron detalles para el pedido con ID: ${pedidoId}`,
        );
      }

      return detallesPedido;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al buscar los detalles del pedido',
        error,
      );
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Auth('admin', 'empleado')
  @ApiOperation({ summary: 'Desactivar un detalle pedido' })
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.detallesPedidosService.deactivate(id);
  }

  @Patch('activate/:id')
  @ApiBearerAuth()
  @Auth('admin', 'empleado')
  @ApiOperation({ summary: 'Activar un detalle pedido' })
  activate(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.detallesPedidosService.activate(id);
  }
}
