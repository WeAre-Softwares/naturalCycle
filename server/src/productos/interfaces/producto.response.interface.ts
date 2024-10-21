import type { TipoPrecio } from '../types/tipo-precio.enum';

export interface ProductoResponse {
  producto_id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tipo_de_precio: TipoPrecio;
  producto_destacado: boolean;
  en_promocion: boolean;
  nuevo_ingreso: boolean;
  marca: {
    nombre: string;
    marca_destacada: boolean;
    imagen_url: string;
  };
  categorias: {
    nombre: string;
  }[];
  etiquetas: {
    nombre: string;
  }[];
  imagenes: {
    url: string;
  }[];
}
