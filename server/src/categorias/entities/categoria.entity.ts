import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'categorias' })
export class Categoria {
  @PrimaryGeneratedColumn('uuid')
  categoria_id: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  nombre: string;

  @Index() // Sirve para mejorar el rendimiento en búsquedas
  @Column({
    type: 'boolean',
    default: true,
  })
  esta_activo: boolean;
}
