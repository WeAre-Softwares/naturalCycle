import { Module } from '@nestjs/common';
import { DetallesPedidosService } from './detalles_pedidos.service';
import { DetallesPedidosController } from './detalles_pedidos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetallesPedido } from './entities/detalles_pedido.entity';

@Module({
  controllers: [DetallesPedidosController],
  providers: [DetallesPedidosService],
  imports: [TypeOrmModule.forFeature([DetallesPedido])],
  exports: [DetallesPedidosService, TypeOrmModule],
})
export class DetallesPedidosModule {}
