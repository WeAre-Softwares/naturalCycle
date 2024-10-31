import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Producto } from './producto.entity';
import { Categoria } from '../../categorias/entities/categoria.entity';

@Entity({ name: 'productos_categorias' })
export class ProductosCategorias {
  @PrimaryGeneratedColumn('increment')
  productos_categorias_id: number;

  @Column({ type: 'boolean', default: true })
  esta_activo: boolean;

  // Relación con Producto
  @ManyToOne(() => Producto, (producto) => producto.productosCategorias, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  // Relación con Categoria
  @ManyToOne(() => Categoria, (categoria) => categoria.productosCategorias, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;
}
