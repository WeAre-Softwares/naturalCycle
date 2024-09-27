import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosImagenes } from './entities/productos_imagenes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductosImagenes])],
  exports: [TypeOrmModule],
})
export class ProductosImagenesModule {}
