import { Remito } from '../entities/remito.entity';

export interface GetAllRemitosResponse {
  remitos: Remito[];
  total: number;
  limit: number;
  offset: number;
}
