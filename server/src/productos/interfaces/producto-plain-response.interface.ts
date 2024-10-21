import { boolean } from 'joi';
import type { TipoPrecio } from '../types/tipo-precio.enum';

export interface ProductoPlainResponse {
  producto_id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  tipo_de_precio: TipoPrecio;
  disponible: boolean;
  producto_destacado: boolean;
  en_promocion: boolean;
  nuevo_ingreso: boolean;
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
