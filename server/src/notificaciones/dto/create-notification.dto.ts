import { IsEnum, IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { TipoNotificacion } from '../entities/notificacion.entity';

export class CreateNotificacionDto {
  @IsEnum(TipoNotificacion)
  tipo: TipoNotificacion;

  @IsBoolean()
  esta_activo: boolean;

  @IsUUID()
  @IsOptional()
  usuario_id?: string;

  @IsUUID()
  @IsOptional()
  pedido_id?: string;
}
