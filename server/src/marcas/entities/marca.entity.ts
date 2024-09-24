import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'marcas' })
export class Marca {
  @PrimaryGeneratedColumn('uuid')
  marca_id: string;

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

  @Index() // Sirve para mejorar el rendimiento en búsquedas
  @Column({
    type: 'boolean',
    default: true,
  })
  esta_activo: boolean;
}
