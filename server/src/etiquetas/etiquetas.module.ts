import { Module } from '@nestjs/common';
import { EtiquetasService } from './etiquetas.service';
import { EtiquetasController } from './etiquetas.controller';
import { Etiqueta } from './entities/etiqueta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [EtiquetasController],
  providers: [EtiquetasService],
  imports: [TypeOrmModule.forFeature([Etiqueta])],
  exports: [EtiquetasService, TypeOrmModule],
})
export class EtiquetasModule {}
