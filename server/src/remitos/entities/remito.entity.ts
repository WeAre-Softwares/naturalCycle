import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pedido } from '../../pedidos/entities/pedido.entity';

@Entity({ name: 'remitos' })
export class Remito {
  @PrimaryGeneratedColumn('uuid')
  remito_id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  nombre_comprador: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  domicilio_comprador: string;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  dni_comprador: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  nombre_vendedor: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  domicilio_vendedor: string;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  dni_vendedor: number;

  // Genera automáticamente la fecha de creación
  @CreateDateColumn({ type: 'timestamp' })
  fecha_generacion: Date;

  @Column({
    type: 'decimal',
    precision: 10, // Total de dígitos
    scale: 2, // Dígitos después del punto decimal
    nullable: false,
  })
  total_precio: number; // 99999999.99

  @OneToOne(() => Pedido)
  @JoinColumn({ name: 'pedido_id' }) // Definición FK
  pedido: Pedido;
}
