import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { Categoria } from './entities/categoria.entity';
import { ProductosCategorias } from '../productos/entities';

@Module({
  controllers: [CategoriasController],
  providers: [CategoriasService],
  imports: [TypeOrmModule.forFeature([Categoria, ProductosCategorias])],
  exports: [CategoriasService, TypeOrmModule],
})
export class CategoriasModule {}
