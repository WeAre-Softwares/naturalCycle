import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { EstadoPedido } from '../types/estado-pedido.enum';

@Entity({ name: 'pedidos' })
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  pedido_id: string;

  @Column({
    type: 'enum',
    enum: EstadoPedido,
  })
  estado_pedido: EstadoPedido;

  //TODO: Ver cantidad digitos
  @Column({
    type: 'decimal', // 'decimal' para evitar problemas de precisión
    precision: 10, // Total de dígitos
    scale: 2, // Dígitos después del punto decimal
    nullable: false,
  })
  total_precio: number; // 99,999,999.99 (8 dígitos en la parte entera, 2 dígitos decimales)
}
