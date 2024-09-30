import { Module } from '@nestjs/common';
import { EtiquetasService } from './etiquetas.service';
import { EtiquetasController } from './etiquetas.controller';
import { Etiqueta } from './entities/etiqueta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosEtiquetas } from '../productos/entities';

@Module({
  controllers: [EtiquetasController],
  providers: [EtiquetasService],
  imports: [TypeOrmModule.forFeature([Etiqueta, ProductosEtiquetas])],
  exports: [EtiquetasService, TypeOrmModule],
})
export class EtiquetasModule {}
