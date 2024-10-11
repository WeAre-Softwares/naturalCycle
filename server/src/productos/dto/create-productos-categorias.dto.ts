import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateProductosCategoriasDto {
  @ApiProperty({
    example: 'uuid-categoria1',
    description: 'ID de la categoría asociada al producto',
  })
  @IsUUID()
  categoria_id: string;
}
