import { ProductosCategorias } from '../../productos/entities';

export interface CategoriaInterface {
  categoria_id: string;
  nombre: string;
  esta_activo: boolean;
  productosCategorias: ProductosCategorias[];
}
