import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'remitos' })
export class Remito {
  @PrimaryGeneratedColumn('uuid')
  remito_id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  nombre_comprador: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  domicilio_comprador: string;

  @Column({
    type: 'text', // Se usa 'text' para evitar perder ceros iniciales
    nullable: false,
  })
  dni_comprador: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  nombre_vendedor: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  domicilio_vendedor: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  dni_vendedor: string;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  fecha_generacion: Date;

  //TODO: Ver cantidad digitos
  @Column({
    type: 'decimal',
    precision: 10, // Total de dígitos
    scale: 2, // Dígitos después del punto decimal
    nullable: false,
  })
  total_precio: number; // 99999999.99
}
