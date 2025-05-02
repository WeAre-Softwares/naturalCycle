import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateDetallesPedidoDto {
  @ApiProperty({
    description: 'Cantidad de productos solicitados en el pedido',
    example: 3,
  })
  @IsNumber()
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  @IsNotEmpty()
  cantidad: number;

  @ApiProperty({
    description: 'Precio unitario del producto en el pedido',
    example: 999.99,
  })
  @IsNumber()
  @IsNotEmpty()
  precio_unitario: number;

  @ApiProperty({
    description: 'ID del producto asociado a este detalle de pedido',
    example: 'd839b1e2-8c5f-40cf-b9e1-24a6d46b6fcd',
  })
  @IsUUID('4', { message: 'El ID del producto debe ser un UUID válido' })
  @IsNotEmpty()
  producto_id: string;

  @ApiProperty({
    description: 'Descuento a aplicar (en porcentaje) para el cálculo, no se almacena',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  descuento?: number;
}
