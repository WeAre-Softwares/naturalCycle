import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    example: 10,
    description: 'Cantidad de elementos a retornar',
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    example: 0,
    description:
      'Cantidad de elementos a omitir antes de comenzar a recolectar el conjunto de resultados',
    required: false,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
