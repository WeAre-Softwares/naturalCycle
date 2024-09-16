import { Module } from '@nestjs/common';
import { RemitosService } from './remitos.service';
import { RemitosController } from './remitos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Remito } from './entities/remito.entity';

@Module({
  controllers: [RemitosController],
  providers: [RemitosService],
  imports: [TypeOrmModule.forFeature([Remito])],
  exports: [RemitosService, TypeOrmModule],
})
export class RemitosModule {}
