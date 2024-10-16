import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemitosService } from './remitos.service';
import { RemitosController } from './remitos.controller';
import { Remito } from './entities/remito.entity';
import { PedidosModule } from '../pedidos/pedidos.module';
import { DetallesPedidosModule } from '../detalles_pedidos/detalles_pedidos.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [RemitosController],
  providers: [RemitosService],
  imports: [
    TypeOrmModule.forFeature([Remito]),
    forwardRef(() => PedidosModule),
    DetallesPedidosModule,
    AuthModule,
  ],
  exports: [RemitosService, TypeOrmModule],
})
export class RemitosModule {}
