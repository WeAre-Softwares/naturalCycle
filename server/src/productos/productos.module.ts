import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { Etiqueta } from '../etiquetas/entities/etiqueta.entity';
import { ProductosCategorias, ProductosEtiquetas } from './entities';

@Module({
  controllers: [ProductosController],
  providers: [ProductosService],
  imports: [
    TypeOrmModule.forFeature([
      Producto,
      Categoria,
      ProductosCategorias,
      Etiqueta,
      ProductosEtiquetas,
    ]),
  ],
  exports: [ProductosService, TypeOrmModule],
})
export class ProductosModule {}
