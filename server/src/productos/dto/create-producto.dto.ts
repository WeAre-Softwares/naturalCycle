import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TipoPrecio } from '../types/tipo-precio.enum';

export class CreateProductoDto {
  @ApiProperty({
    example: 'Harina Integral',
    nullable: false,
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  nombre: string;

  @ApiProperty({
    example: 'Harina integral sin tacc, sin gluten.',
    nullable: false,
    minLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  descripcion: string;

  @ApiProperty({
    example: 1500,
    nullable: false,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Type(() => Number) // Este decorador convierte el string a número
  precio: number;

  @ApiProperty({
    enum: TipoPrecio,
    nullable: false,
  })
  @IsEnum(TipoPrecio)
  tipo_de_precio: TipoPrecio;

  @ApiProperty({
    example: true,
    description: 'Producto destacado SI = true; NO = false;',
    nullable: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => (value === 'true' || value === true ? true : false)) // Conversión explícita
  producto_destacado?: boolean;

  @ApiProperty({
    example: true,
    description: 'En promoción SI = true; NO = false;',
    nullable: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => (value === 'true' || value === true ? true : false)) // Conversión explícita
  en_promocion?: boolean;

  // Propiedad para recibir el ID de la marca
  @ApiProperty({
    example: 'uuid-de-la-marca',
    description: 'ID de la marca asociada al producto',
  })
  @IsUUID()
  @IsNotEmpty()
  marca_id: string;

  // Propiedad para recibir el ID de la categoria
  @ApiProperty({
    example: 'uuid-de-la-categoria',
    description: 'ID de la categoria asociada al producto',
  })
  @IsUUID()
  @IsNotEmpty()
  categoria_id: string;

  // Propiedad para recibir el ID de la etiqueta
  @ApiProperty({
    example: 'uuid-de-la-etiqueta',
    description: 'ID de la etiqueta asociada al producto',
  })
  @IsUUID()
  @IsNotEmpty()
  etiqueta_id: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Imágenes del producto',
    required: true,
    isArray: true,
  })
  @IsOptional()
  imagenes?: any[];
}
