import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'etiquetas' })
export class Etiqueta {
  @PrimaryGeneratedColumn('uuid')
  etiqueta_id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  nombre: string;
}
