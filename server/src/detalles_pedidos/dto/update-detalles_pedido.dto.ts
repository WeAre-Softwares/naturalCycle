import { PartialType } from '@nestjs/swagger';
import { CreateDetallesPedidoDto } from './create-detalles_pedido.dto';

export class UpdateDetallesPedidoDto extends PartialType(CreateDetallesPedidoDto) {}
