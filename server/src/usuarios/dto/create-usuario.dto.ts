import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
  Length,
  Matches,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Pablo',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  @Transform(
    ({ value }) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
  ) // Capitaliza la primera letra
  nombre: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Rosales',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  @Transform(
    ({ value }) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
  ) // Capitaliza la primera letra
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
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 255) // Longitud mínima de 8 caracteres
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).+$/, {
    message:
      'La contraseña debe tener al menos una letra mayúscula, un número y un carácter especial.',
  })
  password: string;
}
