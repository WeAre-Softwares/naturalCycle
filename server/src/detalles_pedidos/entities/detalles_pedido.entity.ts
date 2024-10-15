import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';
import { Pedido } from '../../pedidos/entities/pedido.entity';

@Entity({ name: 'detalles_pedidos' })
export class DetallesPedido {
  @PrimaryGeneratedColumn('uuid')
  detalles_pedidos_id: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  cantidad: number;

  @Column({
    type: 'decimal',
    precision: 10, // Total de dígitos
    scale: 2, // Dígitos después del punto decimal
    nullable: false,
  })
  precio_unitario: number; // 99,999,999.99

  @Column({
    type: 'decimal',
    precision: 10, // Total de dígitos
    scale: 2, // Dígitos después del punto decimal
    nullable: false,
  })
  total_precio: number; // 99,999,999.99

  @Index() // Índice para optimizar consultas por estado
  @Column({
    type: 'boolean',
    default: true,
  })
  esta_activo: boolean;

  @ManyToOne(() => Producto, (producto) => producto.detalles_pedido)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @ManyToOne(() => Pedido, (pedido) => pedido.detalles_pedido, {
    onDelete: 'CASCADE', // Asegura la eliminación en cascada en base de datos //TODO: remove
  })
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;
}
