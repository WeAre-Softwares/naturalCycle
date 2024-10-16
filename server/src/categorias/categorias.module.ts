import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { Categoria } from './entities/categoria.entity';
import { ProductosCategorias } from '../productos/entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CategoriasController],
  providers: [CategoriasService],
  imports: [
    TypeOrmModule.forFeature([Categoria, ProductosCategorias]),
    AuthModule,
  ],
  exports: [CategoriasService, TypeOrmModule],
})
export class CategoriasModule {}
