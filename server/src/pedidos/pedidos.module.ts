import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { Pedido } from './entities/pedido.entity';
import { AuthModule } from '../auth/auth.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { NotificacionesModule } from 'src/notificaciones/notificaciones.module';
import { DetallesPedidosModule } from 'src/detalles_pedidos/detalles_pedidos.module';

@Module({
  controllers: [PedidosController],
  providers: [PedidosService],
  imports: [TypeOrmModule.forFeature([Pedido]), AuthModule, UsuariosModule, NotificacionesModule, DetallesPedidosModule],
  exports: [PedidosService, TypeOrmModule],
})
export class PedidosModule {}
