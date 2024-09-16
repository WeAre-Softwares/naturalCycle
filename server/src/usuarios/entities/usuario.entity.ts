import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RolesUsuario } from '../types/roles.enum';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  usuario_id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  nombre: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  apellido: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  dni: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  nombre_comercio: string;

  @Column({
    type: 'text', // Cambiado a 'text' para incluir caracteres especiales y evitar pérdida de ceros.
    nullable: false,
  })
  telefono: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  dom_fiscal: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  email: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  email_verificado: boolean;

  @Column({
    type: 'text',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'enum',
    enum: RolesUsuario,
    nullable: false,
  })
  roles: RolesUsuario;

  @Column({
    type: 'boolean',
    default: true,
  })
  esta_activo: boolean;
}
