import type { PedidoInterface } from './pedido.interface';

export interface GetPedidosResponse {
  pedidos: PedidoInterface[];
  total: number;
  limit: number;
  offset: number;
}
