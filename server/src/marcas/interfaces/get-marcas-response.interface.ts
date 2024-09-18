import type { MarcaInterface } from './marca.interface';

export interface GetMarcasResponse {
  marcas: MarcaInterface[];
  total: number;
  limit: number;
  offset: number;
}
