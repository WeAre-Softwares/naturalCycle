import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMarcaDto {
  @ApiProperty({
    example: 'Maní King',
    description: 'Nombre de la marca',
    nullable: false,
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  nombre: string;

  @ApiProperty({
    example: true,
    description: 'Marca destacada SI = true; NO = false;',
    nullable: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => (value === 'true' || value === true ? true : false)) // Conversión explícita
  marca_destacada?: boolean;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Imagen de la marca',
  })
  image: any; // Campo para la imagen

  @IsString()
  @IsOptional() // Controlado desde el controlador
  @MaxLength(255)
  imagen_url?: string;

  @IsString()
  @IsOptional() // Controlado desde el controlador
  @MaxLength(255)
  public_id?: string;
}
