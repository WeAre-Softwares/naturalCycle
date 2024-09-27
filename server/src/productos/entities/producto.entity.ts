import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TipoPrecio } from '../types/tipo-precio.enum';
import { ProductosImagenes } from 'src/productos_imagenes/entities/productos_imagenes.entity';

@Entity({ name: 'productos' })
export class Producto {
  @PrimaryGeneratedColumn('uuid')
  producto_id: string;

  @Index() // Índice para mejorar la búsqueda por nombre
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
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
    type: 'boolean',
    default: true,
  })
  disponible: boolean;

  @Index() // Índice para optimizar consultas por estado
  @Column({
    type: 'boolean',
    default: true,
  })
  esta_activo: boolean;

  @Index() // índice para mejorar el rendimiento en búsquedas por productos destacados
  @Column({
    type: 'boolean',
    default: false,
  })
  producto_destacado: boolean;

  @Index() // índice para mejorar el rendimiento en búsquedas por productos con promociones
  @Column({
    type: 'boolean',
    default: false,
  })
  en_promocion: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  fecha_actualizacion: Date;

  // Establecer relaciones
  @OneToMany(
    () => ProductosImagenes,
    (productosImagenes) => productosImagenes.producto,
    {
      cascade: true, // Esto permite que al crear un producto, también se creen las imágenes asociadas automáticamente
    },
  )
  imagenes: ProductosImagenes[];
}
