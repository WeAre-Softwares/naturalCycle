import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DetallesPedidosService } from './detalles_pedidos.service';
import { DetallesPedido } from './entities/detalles_pedido.entity';
import type { GetDetallesPedidosResponse } from './interfaces';
import { SearchWithPaginationDto, PaginationDto } from '../common/dtos';
import { CreateDetallesPedidoDto, UpdateDetallesPedidoDto } from './dto';

@ApiTags('Detalles_pedidos')
// @ApiBearerAuth()
@Controller('detalles-pedidos')
export class DetallesPedidosController {
  constructor(
    private readonly detallesPedidosService: DetallesPedidosService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un detalles pedido' })
  create(@Body() createDetallesPedidoDto: CreateDetallesPedidoDto) {
    return this.detallesPedidosService.create(createDetallesPedidoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Buscar todos los detalles pedidos' })
  findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<GetDetallesPedidosResponse> {
    return this.detallesPedidosService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalle pedido por id' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<DetallesPedido> {
    return this.detallesPedidosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un detalle pedido' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDetallesPedidoDto: UpdateDetallesPedidoDto,
  ): Promise<Partial<DetallesPedido>> {
    return this.detallesPedidosService.update(id, updateDetallesPedidoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar un detalle pedido' })
  deactivate(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.detallesPedidosService.deactivate(id);
  }

  @Patch('activate/:id')
  @ApiOperation({ summary: 'Activar un detalle pedido' })
  activate(@Param('id', ParseUUIDPipe) id: string): Promise<{
    mensaje: string;
  }> {
    return this.detallesPedidosService.activate(id);
  }
}
