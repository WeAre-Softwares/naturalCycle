import { DetallesPedido } from '../entities/detalles_pedido.entity';

export interface GetDetallesPedidosResponse {
  detalles_pedidos: DetallesPedido[];
  total: number;
  limit: number;
  offset: number;
}
