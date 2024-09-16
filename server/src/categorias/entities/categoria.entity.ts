import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'categorias' })
export class Categoria {
  @PrimaryGeneratedColumn('uuid')
  categoria_id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  nombre: string;
}
