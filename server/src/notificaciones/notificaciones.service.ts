import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { Repository } from 'typeorm';
import { TipoNotificacion } from './entities/notificacion.entity';
import { WebsocketsGateway } from 'src/websocket/websocket.gateway';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepository: Repository<Notificacion>,
    private readonly websocketsGateway: WebsocketsGateway
  ) { }

  async findAll(): Promise<Notificacion[]>{
    return this.notificacionRepository.find();
  }

  async findByUsuario(): Promise<Notificacion[]> {
    return this.notificacionRepository.find({
      where: { tipo: TipoNotificacion.USUARIO }
    });
  }

  async findByPedido(): Promise<Notificacion[]> {
    return this.notificacionRepository.find({
      where: { tipo: TipoNotificacion.PEDIDO }
    });
  }

  async createNotification(tipo: TipoNotificacion): Promise<Notificacion> {
    const notificacion = this.notificacionRepository.create({
      tipo,
      esta_activo: true,
    });

    const savedNotification = await this.notificacionRepository.save(notificacion);

    this.websocketsGateway.sendNotification(savedNotification)

    return savedNotification;
  }

  async updatedNotification(type: TipoNotificacion): Promise<void> {
    this.notificacionRepository.update({
       tipo: type
     }, {
       esta_activo: false
     }
     );
  }
}
