import type { CategoriaInterface } from './categoria.interface';

export interface GetCategoriasResponse {
  categorias: CategoriaInterface[];
  total: number;
  limit: number;
  offset: number;
}
