import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';

@Entity({ name: 'productos_imagenes' })
export class ProductosImagenes {
  @PrimaryGeneratedColumn('uuid')
  imagenes_producto_id: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
  })
  url: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  public_id: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fecha_creacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fecha_actualizacion: Date;

  @ManyToOne(() => Producto, (producto) => producto.imagenes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'producto_id' }) // Especificar el nombre de la columna FK
  producto: Producto;
}
