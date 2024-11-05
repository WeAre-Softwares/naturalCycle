import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CategoryFilterDto {
  @ApiProperty({
    description: 'Id de la categoría',
    example: '48832f9e-3812-44aa-97c0-9dec941d6f54',
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Bebidas',
  })
  @IsOptional()
  @IsString()
  nombre?: string;
}
