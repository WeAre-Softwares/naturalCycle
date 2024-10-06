import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { RolesUsuario } from '../types/roles.enum';

export class UpdateUserByAdminDto {
  @ApiProperty({
    example: 'true',
    description: 'Indica si el usuario ha verificado su correo electrónico',
    default: 'false',
  })
  @IsBoolean()
  @IsOptional()
  email_verificado?: boolean;

  @ApiProperty({
    example: 'true',
    description: 'Indica si la cuenta del usuario está activa',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  esta_activo?: boolean;

  @ApiProperty({
    example: ['admin', 'empleado', 'usuario'],
    description: 'Roles asignados al usuario',
    default: [null],
  })
  @IsArray()
  @IsEnum(RolesUsuario, { each: true })
  @IsOptional()
  roles?: RolesUsuario[];
}
