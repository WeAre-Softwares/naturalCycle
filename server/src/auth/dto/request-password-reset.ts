import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestPasswordResetDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'El correo electrónico del usuario',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
