import { Module } from '@nestjs/common';
import { ProductosImagenesService } from './productos_imagenes.service';
import { ProductosImagenesController } from './productos_imagenes.controller';

@Module({
  controllers: [ProductosImagenesController],
  providers: [ProductosImagenesService],
})
export class ProductosImagenesModule {}
