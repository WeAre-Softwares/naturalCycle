import { Module } from '@nestjs/common';
import { EtiquetasService } from './etiquetas.service';
import { EtiquetasController } from './etiquetas.controller';
import { Etiqueta } from './entities/etiqueta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosEtiquetas } from '../productos/entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [EtiquetasController],
  providers: [EtiquetasService],
  imports: [
    TypeOrmModule.forFeature([Etiqueta, ProductosEtiquetas]),
    AuthModule,
  ],
  exports: [EtiquetasService, TypeOrmModule],
})
export class EtiquetasModule {}
