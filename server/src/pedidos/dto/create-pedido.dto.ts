import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { EstadoPedido } from '../types/estado-pedido.enum';

export class CreatePedidoDto {
  @ApiProperty({
    description: 'Estado del pedido',
    enum: EstadoPedido,
    default: EstadoPedido.esperando_aprobacion,
  })
  @IsEnum(EstadoPedido)
  @IsNotEmpty()
  estado_pedido: EstadoPedido;

  @ApiProperty({
    description: 'Precio total del pedido',
    example: 9999.99,
  })
  @IsNumber()
  @IsNotEmpty()
  total_precio: number;
}
