import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TipoPrecio } from '../types/tipo-precio.enum';

@Entity({ name: 'productos' })
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  producto_id: string;

  @Column({
    type: 'text',
    nullable: false,
    unique: true,
  })
  nombre: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  descripcion: string;

  //TODO: Ver cantidad digitos
  @Column({
    type: 'decimal', // 'decimal' para evitar problemas de precisión
    precision: 10, // Total de dígitos
    scale: 2, // Dígitos después del punto decimal
    nullable: false,
  })
  precio: number; // 99,999,999.99 (8 dígitos en la parte entera, 2 dígitos decimales)

  @Column({
    type: 'enum',
    enum: TipoPrecio,
  })
  tipo_de_precio: TipoPrecio;

  @Column({
    type: 'bool',
    default: true,
  })
  disponible: boolean;

  @Column({
    type: 'bool',
    default: true,
  })
  esta_activo: string;

  // Establecer relaciones
}
