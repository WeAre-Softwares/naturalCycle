import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
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

  @Column()
  fecha_creacion: Date;

  @Column()
  fecha_actualizacion: Date;

  @BeforeInsert()
  setCreationDate() {
    this.fecha_creacion = new Date();
  }

  @BeforeUpdate()
  setUpdateDate() {
    this.fecha_actualizacion = new Date();
  }

  @ManyToOne(() => Producto, (producto) => producto.imagenes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'producto_id' }) // Especificar el nombre de la columna FK
  producto: Producto;
}
