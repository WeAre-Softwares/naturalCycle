import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { Pedido } from './entities/pedido.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [PedidosController],
  providers: [PedidosService],
  imports: [TypeOrmModule.forFeature([Pedido])],
  exports: [PedidosService, TypeOrmModule],
})
export class PedidosModule {}
