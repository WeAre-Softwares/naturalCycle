import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

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
    description: 'Total del precio por la cantidad de productos solicitados',
    example: 2999.97,
  })
  @IsNumber()
  @IsNotEmpty()
  total_precio: number;

  @ApiProperty({
    description: 'ID del pedido al cual pertenece este detalle',
    example: 'eebf6d58-9b3f-4e91-b5f8-1c70cf913649',
  })
  @IsUUID('4', { message: 'El ID del pedido debe ser un UUID válido' })
  @IsNotEmpty()
  pedido_id: string;

  @ApiProperty({
    description: 'ID del producto asociado a este detalle de pedido',
    example: 'd839b1e2-8c5f-40cf-b9e1-24a6d46b6fcd',
  })
  @IsUUID('4', { message: 'El ID del producto debe ser un UUID válido' })
  @IsNotEmpty()
  producto_id: string;
}
