import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductosEtiquetas } from '../../productos/entities';

@Entity({ name: 'etiquetas' })
export class Etiqueta {
  @PrimaryGeneratedColumn('uuid')
  etiqueta_id: string;

  @Index() // Índice para mejorar la búsqueda por nombre
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  nombre: string;

  @Index() // Índice para optimizar consultas por estado
  @Column({
    type: 'boolean',
    default: true,
  })
  esta_activo: boolean;

  // Relación 1 a N con la tabla intermedia ProductosEtiquetas
  @OneToMany(
    () => ProductosEtiquetas,
    (productosEtiquetas) => productosEtiquetas.producto,
  )
  productosEtiquetas: ProductosEtiquetas[];
}
