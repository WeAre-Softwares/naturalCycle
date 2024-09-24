import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateEtiquetaDto {
  @ApiProperty({
    example: 'Sin gluten',
    description: 'Nombre de la Etiqueta',
    nullable: false,
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  nombre: string;
}
