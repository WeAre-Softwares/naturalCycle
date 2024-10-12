import type { EstadoPedido } from '../types/estado-pedido.enum';

export interface PedidoInterface {
  pedido_id: string;
  estado_pedido: EstadoPedido;
  total_precio: number;
}
