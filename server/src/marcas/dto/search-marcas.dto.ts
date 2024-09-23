import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { PaginationDto } from '../../common/dtos/pagination.dto';

export class SearchWithPaginationDto extends PartialType(PaginationDto) {
  @ApiProperty({
    description: 'Término de búsqueda para filtrar marcas por nombre',
    example: 'Maní King',
    required: true,
  })
  @IsNotEmpty()
  term?: string;
}
