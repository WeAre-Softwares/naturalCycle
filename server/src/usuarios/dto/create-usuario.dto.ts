import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  Length,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Pablo',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  nombre: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Rosales',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  apellido: string;

  @ApiProperty({
    description: 'DNI del usuario',
    example: 12345678,
  })
  @IsNumber()
  dni: number;

  @ApiProperty({
    description: 'Nombre del comercio',
    example: 'MiComercio',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  nombre_comercio: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario en formato internacional',
    example: '+54 9 11 1234-5678',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 18)
  telefono: string;

  @ApiProperty({
    description: 'Domicilio fiscal del usuario',
    example: 'Av. Siempre Viva 123',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  dom_fiscal: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  password: string;
}
