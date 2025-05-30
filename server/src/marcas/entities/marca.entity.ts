import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity({ name: 'marcas' })
export class Marca {
  @PrimaryGeneratedColumn('uuid')
  marca_id: string;

  @Index() // Índice para mejorar la búsqueda por nombre
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  nombre: string;

  @Index() // índice para mejorar el rendimiento en búsquedas por marcas destacadas
  @Column({
    type: 'boolean',
    default: false,
  })
  marca_destacada: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  imagen_url: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  public_id: string;

  @Index() // Índice para optimizar consultas por estado
  @Column({
    type: 'boolean',
    default: true,
  })
  esta_activo: boolean;

  @OneToMany(() => Producto, (producto) => producto.marca)
  productos: Producto[];
}
