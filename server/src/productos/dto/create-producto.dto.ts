import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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
  precio: number;

  @ApiProperty({
    enum: TipoPrecio,
    nullable: false,
  })
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
}
