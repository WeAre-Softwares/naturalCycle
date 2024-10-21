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
import { TipoPrecio } from '../types/tipo-precio.enum';
import { ProductosImagenes } from '../../productos_imagenes/entities/productos_imagenes.entity';
import { Marca } from '../../marcas/entities/marca.entity';
import { ProductosCategorias } from './productos-categorias.entity';
import { ProductosEtiquetas } from './productos-etiquetas.entity';
import { DetallesPedido } from 'src/detalles_pedidos/entities/detalles_pedido.entity';

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

  @Index() // índice para mejorar el rendimiento en búsquedas para productos de nuevos ingresos
  @Column({
    type: 'boolean',
    default: false,
  })
  nuevo_ingreso: boolean;

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

  @OneToMany(
    () => DetallesPedido,
    (detalles_pedidos) => detalles_pedidos.producto,
  )
  detalles_pedido: DetallesPedido[];

  @ManyToOne(() => Marca, (marca) => marca.productos)
  @JoinColumn({ name: 'marca_id' })
  marca: Marca;

  // Relación 1 a N con la tabla intermedia ProductosCategorias
  @OneToMany(
    () => ProductosCategorias,
    (productosCategorias) => productosCategorias.producto,
    {
      cascade: true, // Eliminar categorías asociadas cuando se elimina el producto
    },
  )
  productosCategorias: ProductosCategorias[];

  // Relación 1 a N con la tabla intermedia ProductosEtiquetas
  @OneToMany(
    () => ProductosEtiquetas,
    (productosEtiquetas) => productosEtiquetas.producto,
    {
      cascade: true, // Eliminar etiquetas asociadas cuando se elimina el producto
    },
  )
  productosEtiquetas: ProductosEtiquetas[];
}
