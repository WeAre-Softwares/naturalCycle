import type { Usuario } from '../entities/usuario.entity';

export interface FindAllUsersResponse {
  usuarios: Usuario[];
  total: number;
  limit: number;
  offset: number;
}
