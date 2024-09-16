import { Module } from '@nestjs/common';
import { ProductosImagenesService } from './productos_imagenes.service';
import { ProductosImagenesController } from './productos_imagenes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosImagenes } from './entities/productos_imagene.entity';

@Module({
  controllers: [ProductosImagenesController],
  providers: [ProductosImagenesService],
  imports: [TypeOrmModule.forFeature([ProductosImagenes])],
  exports: [ProductosImagenesService, TypeOrmModule],
})
export class ProductosImagenesModule {}
