import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateProductosEtiquetasDto {
  @ApiProperty({
    example: 'uuid-etiqueta1',
    description: 'ID de la etiqueta',
  })
  @IsUUID()
  etiqueta_id: string;
}
