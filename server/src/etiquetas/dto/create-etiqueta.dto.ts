import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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
  @Transform(
    ({ value }) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
  ) // Capitaliza la primera letra
  nombre: string;
}
