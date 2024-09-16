import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'marcas' })
export class Marca {
  @PrimaryGeneratedColumn('uuid')
  marca_id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  nombre: string;
}
