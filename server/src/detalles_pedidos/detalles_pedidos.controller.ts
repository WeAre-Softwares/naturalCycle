import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetallesPedidosService } from './detalles_pedidos.service';
import { CreateDetallesPedidoDto } from './dto/create-detalles_pedido.dto';
import { UpdateDetallesPedidoDto } from './dto/update-detalles_pedido.dto';

@Controller('detalles-pedidos')
export class DetallesPedidosController {
  constructor(private readonly detallesPedidosService: DetallesPedidosService) {}

  @Post()
  create(@Body() createDetallesPedidoDto: CreateDetallesPedidoDto) {
    return this.detallesPedidosService.create(createDetallesPedidoDto);
  }

  @Get()
  findAll() {
    return this.detallesPedidosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detallesPedidosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetallesPedidoDto: UpdateDetallesPedidoDto) {
    return this.detallesPedidosService.update(+id, updateDetallesPedidoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detallesPedidosService.remove(+id);
  }
}
