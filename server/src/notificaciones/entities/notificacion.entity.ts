import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TipoNotificacion {
  USUARIO = 'usuario',
  PEDIDO = 'pedido',
}
@Entity({ name: 'notificaciones' })
export class Notificacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TipoNotificacion,
    nullable: false,
  })
  tipo: TipoNotificacion;

  @Column({
    type: 'boolean',
    default: true,
  })
  esta_activo: boolean;
}
