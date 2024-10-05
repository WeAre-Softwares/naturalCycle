import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RolesUsuario } from '../types/roles.enum';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  usuario_id: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
  })
  apellido: string;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  dni: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  nombre_comercio: string;

  @Column({
    type: 'varchar',
    length: 18, // Ejemplo: +54 9 11 1234-5678 (18 caracteres incluyendo espacios y el +).
    nullable: false,
  })
  telefono: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  dom_fiscal: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  email_verificado: boolean;

  @Column({
    type: 'varchar',
    length: 255,
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
