import { Module } from '@nestjs/common';
import { RemitosService } from './remitos.service';
import { RemitosController } from './remitos.controller';

@Module({
  controllers: [RemitosController],
  providers: [RemitosService],
})
export class RemitosModule {}
