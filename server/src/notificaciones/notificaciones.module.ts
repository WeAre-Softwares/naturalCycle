import { Module } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { WebsocketsGateway } from 'src/websocket/websocket.gateway';

@Module({
  controllers: [NotificacionesController],
  providers: [NotificacionesService, WebsocketsGateway],
  imports: [TypeOrmModule.forFeature([Notificacion])],
  exports: [NotificacionesService, TypeOrmModule]
})
export class NotificacionesModule {}
