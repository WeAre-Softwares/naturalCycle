import type { EtiquetaInterface } from './etiqueta.interface';

export interface GetEtiquetasResponse {
  etiquetas: EtiquetaInterface[];
  total: number;
  limit: number;
  offset: number;
}
