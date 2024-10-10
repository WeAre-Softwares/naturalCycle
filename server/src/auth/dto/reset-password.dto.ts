// reset-password.dto.ts
import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  @Length(8, 255, {
    message: 'La contraseña debe tener al menos 8 caracteres.',
  })
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).+$/, {
    message:
      'La contraseña debe incluir al menos una letra mayúscula, un número y un carácter especial (como *, $, #, etc.).',
  })
  newPassword: string;
}
