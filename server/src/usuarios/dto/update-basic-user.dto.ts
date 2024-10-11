import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateBasicUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Pablo',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  nombre?: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Rosales',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  apellido?: string;

  @ApiProperty({
    description: 'DNI del usuario',
    example: 12345678,
  })
  @IsOptional()
  @IsNumber()
  dni?: number;

  @ApiProperty({
    description: 'Nombre del comercio',
    example: 'MiComercio',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  nombre_comercio?: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario en formato internacional',
    example: '+54 9 11 1234-5678',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 18)
  telefono?: string;

  @ApiProperty({
    description: 'Domicilio fiscal del usuario',
    example: 'Av. Siempre Viva 123',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  dom_fiscal?: string;
}
