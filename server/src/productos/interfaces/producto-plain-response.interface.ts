import type { TipoPrecio } from '../types/tipo-precio.enum';

export interface ProductoPlainResponse {
  producto_id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tipo_de_precio: TipoPrecio;
  disponible: boolean;
  marca: {
    nombre: string;
  };
  imagenes: {
    url: string;
  }[];
  categorias: {
    nombre: string;
  }[];
  etiquetas: {
    nombre: string;
  }[];
}
