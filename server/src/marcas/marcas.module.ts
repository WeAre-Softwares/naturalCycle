import { Module } from '@nestjs/common';
import { MarcasService } from './marcas.service';
import { MarcasController } from './marcas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Marca } from './entities/marca.entity';

@Module({
  controllers: [MarcasController],
  providers: [MarcasService],
  imports: [TypeOrmModule.forFeature([Marca])],
  exports: [MarcasService, TypeOrmModule],
})
export class MarcasModule {}
