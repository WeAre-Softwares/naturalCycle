import { Module } from '@nestjs/common';
import { DetallesPedidosService } from './detalles_pedidos.service';
import { DetallesPedidosController } from './detalles_pedidos.controller';

@Module({
  controllers: [DetallesPedidosController],
  providers: [DetallesPedidosService],
})
export class DetallesPedidosModule {}
