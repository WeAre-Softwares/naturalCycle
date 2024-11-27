import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class BrandFilterDto {
  @ApiProperty({
    description: 'Id de la marca',
    example: '48832f9e-3812-44aa-97c0-9dec941d6f54',
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    description: 'Nombre de la marca',
    example: 'Eco Vital',
  })
  @IsOptional()
  @IsString()
  nombre?: string;
}
