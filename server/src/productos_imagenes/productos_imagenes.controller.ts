import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductosImagenesService } from './productos_imagenes.service';
import { CreateProductosImageneDto } from './dto/create-productos_imagene.dto';
import { UpdateProductosImageneDto } from './dto/update-productos_imagene.dto';

@Controller('productos-imagenes')
export class ProductosImagenesController {
  constructor(private readonly productosImagenesService: ProductosImagenesService) {}

  @Post()
  create(@Body() createProductosImageneDto: CreateProductosImageneDto) {
    return this.productosImagenesService.create(createProductosImageneDto);
  }

  @Get()
  findAll() {
    return this.productosImagenesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosImagenesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductosImageneDto: UpdateProductosImageneDto) {
    return this.productosImagenesService.update(+id, updateProductosImageneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosImagenesService.remove(+id);
  }
}
