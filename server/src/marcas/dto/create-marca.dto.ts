import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateMarcaDto {
  @ApiProperty({
    example: 'Maní King',
    description: 'Nombre de la marca',
    nullable: false,
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  nombre: string;

  @ApiProperty({
    example: 'true',
    description: 'Marca destacada SI = true; NO = false;',
    nullable: true,
  })
  @IsBoolean()
  marca_destacada: boolean;

  @ApiProperty({
    example: 'http://hosting.com/image.jpg',
    description: 'URL de la imagen',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  imagen_url: string;

  @ApiProperty({
    example: 'naturalCycle-marcas/wmd1autejwkoaxbsusuu',
    description: 'Public id de la imagen en Cloundinary',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  public_id: string;
}
