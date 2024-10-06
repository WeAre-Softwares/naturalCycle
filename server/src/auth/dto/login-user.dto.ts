import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'El correo electrónico del usuario',
  })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Ingrese la contraseña',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;
}
