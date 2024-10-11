import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
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
import { CreateProductosCategoriasDto } from './create-productos-categorias.dto';
import { CreateProductosEtiquetasDto } from './create-productos-etiquetas.dto';

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
  @Transform(
    ({ value }) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
  ) // Capitalizar la primera letra
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

  // Propiedad para recibir IDs de múltiples Etiquetas para tabla intermedia
  @ApiProperty({
    example: [
      { etiqueta_id: 'uuid-etiqueta1' },
      { etiqueta_id: 'uuid-etiqueta2' },
    ],
    description: 'IDs de las etiquetas que quiero asociar al producto',
    isArray: true,
    type: CreateProductosEtiquetasDto,
  })
  @IsArray()
  @ArrayNotEmpty()
  productos_etiquetas: CreateProductosEtiquetasDto[];

  // Propiedad para recibir IDs de múltiples Categorías para tabla intermedia
  @ApiProperty({
    example: [
      { categoria_id: 'uuid-categoria1' },
      { categoria_id: 'uuid-categoria2' },
    ],
    description: 'Relación entre categorías y el producto',
    isArray: true,
    type: CreateProductosCategoriasDto,
  })
  @IsArray()
  @ArrayNotEmpty()
  productos_categorias: CreateProductosCategoriasDto[];

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Imágenes del producto',
    required: true,
    isArray: true,
  })
  imagenes: any[];
}
