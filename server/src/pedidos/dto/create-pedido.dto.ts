import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoPedido } from '../types/estado-pedido.enum';
import { CreateDetallesPedidoDto } from '../../detalles_pedidos/dto';

export class CreatePedidoDto {
  @ApiProperty({
    description: 'Estado del pedido',
    enum: EstadoPedido,
    default: EstadoPedido.esperando_aprobacion,
  })
  @IsEnum(EstadoPedido)
  @IsOptional()
  estado_pedido?: EstadoPedido;

  @ApiProperty({
    description: 'Lista de detalles de los productos en el pedido',
    type: [CreateDetallesPedidoDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetallesPedidoDto) // Necesario para la transformación de objetos anidados
  detalles: CreateDetallesPedidoDto[];
}
