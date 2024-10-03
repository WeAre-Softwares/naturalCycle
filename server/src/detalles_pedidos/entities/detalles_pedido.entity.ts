import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  // Establecer relaciones
}
