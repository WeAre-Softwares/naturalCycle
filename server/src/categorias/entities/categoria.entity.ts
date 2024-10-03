import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductosCategorias } from '../../productos/entities';

@Entity({ name: 'categorias' })
export class Categoria {
  @PrimaryGeneratedColumn('uuid')
  categoria_id: string;

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

  // Relación 1 a N con la tabla intermedia ProductosCategorias
  @OneToMany(
    () => ProductosCategorias,
    (productosCategorias) => productosCategorias.producto,
  )
  productosCategorias: ProductosCategorias[];
}
