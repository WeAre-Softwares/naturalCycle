import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { MarcasModule } from '../marcas/marcas.module';
import { EtiquetasModule } from '../etiquetas/etiquetas.module';
import { ProductosImagenesModule } from '../productos_imagenes/productos_imagenes.module';
import { CategoriasModule } from 'src/categorias/categorias.module';

@Module({
  controllers: [ProductosController],
  providers: [ProductosService],
  imports: [
    TypeOrmModule.forFeature([Producto]),
    CategoriasModule,
    CloudinaryModule,
    EtiquetasModule,
    MarcasModule,
    ProductosImagenesModule,
  ],
  exports: [ProductosService, TypeOrmModule],
})
export class ProductosModule {}
