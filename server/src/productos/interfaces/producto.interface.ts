import type { TipoPrecio } from '../types/tipo-precio.enum';

export interface ProductoInterface {
  nombre: string;
  descripcion: string;
  precio: number;
  precio_antes_oferta: number;
  tipo_de_precio: TipoPrecio;
  disponible: boolean;
  esta_activo: boolean;
  producto_destacado: boolean;
  en_promocion: boolean;
  fecha_creacion: Date;
  fecha_actualizacion: Date;
  marca: string;
}
