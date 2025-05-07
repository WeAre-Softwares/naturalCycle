import { Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificacionesService } from './notificaciones.service';
import { TipoNotificacion } from './entities/notificacion.entity';

@ApiTags('Notificaciones')
@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) { }

  @Get()
  findAll() {
    return this.notificacionesService.findAll()
  }

  @Get('/usuario')
  findByUsuario() {
    return this.notificacionesService.findByUsuario()
  }

  @Get('/pedido')
  findByPedido() {
    return this.notificacionesService.findByPedido()
  }

  @Put('/:type')
  removeNotification(@Param('type') type: TipoNotificacion) {
    return this.notificacionesService.updatedNotification(type)
  }
}