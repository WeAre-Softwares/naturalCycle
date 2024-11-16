import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolesUsuario } from '../types/roles.enum';
import { Pedido } from '../../pedidos/entities/pedido.entity';

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
    unique: true,
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
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    select: false, // Este campo no se seleccionará por defecto
  })
  password: string;

  @Column({
    type: 'enum',
    enum: RolesUsuario,
    array: true, // Para aceptar múltiples roles
    default: [], // Permitir que sea un array vacio al registrar un nuevo usuario
    select: false, // Este campo no se seleccionará por defecto
  })
  roles: RolesUsuario[];

  @Column({
    type: 'boolean',
    default: false,
    select: false, // Este campo no se seleccionará por defecto
  })
  esta_activo: boolean;

  @Column({
    type: 'boolean',
    default: false,
    select: false, // Este campo no se seleccionará por defecto
  })
  dado_de_alta: boolean;

  @Column({
    type: 'varchar',
    length: 255, // Ajustado para tokens JWT estándar
    nullable: true,
    select: false, // No se seleccionará por defecto por seguridad
  })
  reset_password_token: string | null;

  @Column({
    type: 'timestamp',
    nullable: true,
    select: false, // No se seleccionará por defecto por seguridad
  })
  last_password_reset_request: Date | null;

  @OneToMany(() => Pedido, (pedido) => pedido.usuario)
  pedidos: Pedido[];
}
