import type { ProductoPlainResponse } from './producto-plain-response.interface';

export interface GetProductosResponse {
  productos: ProductoPlainResponse[];
  total: number;
  limit: number;
  offset: number;
}
