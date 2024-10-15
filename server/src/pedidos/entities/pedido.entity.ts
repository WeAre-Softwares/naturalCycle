import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { EstadoPedido } from '../types/estado-pedido.enum';
import { DetallesPedido } from 'src/detalles_pedidos/entities/detalles_pedido.entity';

@Entity({ name: 'pedidos' })
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  pedido_id: string;

  @Index() // Índice para optimizar consultas
  @Column({
    type: 'enum',
    enum: EstadoPedido,
    default: EstadoPedido.esperando_aprobacion,
  })
  estado_pedido: EstadoPedido;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  fecha_pedido: Date; // Fecha de creación, generada automáticamente al crear el pedido

  @Index() // Índice para optimizar consultas por estado
  @Column({
    type: 'boolean',
    default: true,
  })
  esta_activo: boolean;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  fecha_actualizacion: Date; // Fecha de última actualización, generada automáticamente al actualizar el pedido

  @Column({
    type: 'decimal', // 'decimal' para evitar problemas de precisión
    precision: 10, // Total de dígitos
    scale: 2, // Dígitos después del punto decimal
    nullable: false,
  })
  total_precio: number; // 99,999,999.99 (8 dígitos en la parte entera, 2 dígitos decimales)

  @ManyToOne(() => Usuario, (usuario) => usuario.pedidos)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @OneToMany(
    () => DetallesPedido,
    (detalles_pedido) => detalles_pedido.pedido,
    {
      cascade: ['remove'], // Permitir eliminación en cascada en TypeORM //TODO: remove
      onDelete: 'CASCADE', // Asegurar que se eliminen los detalles del pedido en cascada a nivel de la base de datos
    },
  )
  detalles_pedido: DetallesPedido[];
}
