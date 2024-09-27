import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Producto } from './producto.entity';
import { Etiqueta } from '../../etiquetas/entities/etiqueta.entity';

@Entity({ name: 'productos_etiquetas' })
export class ProductosEtiquetas {
  @PrimaryGeneratedColumn('increment')
  productos_etiquetas_id: number;

  @Column({ type: 'boolean', default: true })
  esta_activo: boolean;

  // Relación con Producto
  @ManyToOne(() => Producto, (producto) => producto.productosEtiquetas)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  // Relación con Etiquetas
  @ManyToOne(() => Etiqueta, (etiquetas) => etiquetas.productosEtiquetas)
  @JoinColumn({ name: 'etiqueta_id' })
  etiqueta: Etiqueta;
}
