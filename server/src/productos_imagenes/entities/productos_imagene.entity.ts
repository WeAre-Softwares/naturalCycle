import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'productos_imagenes' })
export class ProductosImagenes {
  @PrimaryGeneratedColumn('uuid')
  imagenes_producto_id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  url: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  public_id: string;
}
