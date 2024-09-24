import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class SearchWithPaginationDto extends PartialType(PaginationDto) {
  @ApiProperty({
    description: 'Término de búsqueda para filtrar una entidad por nombre',
    example: 'Maní King',
    required: true,
  })
  @IsNotEmpty()
  term?: string;
}
