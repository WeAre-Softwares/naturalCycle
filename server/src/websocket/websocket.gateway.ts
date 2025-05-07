import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { EnvConfiguration } from 'src/config/app.config';
import { Notificacion } from 'src/notificaciones/entities/notificacion.entity';

@WebSocketGateway({
  cors: {
   origin: `${EnvConfiguration().frontendEndPoint}`
  }
})
export class WebsocketsGateway {
  @WebSocketServer()
  server: Server;

  sendNotification(notificacion: Notificacion) {
    this.server.emit('nuevaNotificacion', notificacion)
  }

}
