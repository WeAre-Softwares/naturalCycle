import { ProductosEtiquetas } from '../../productos/entities';

export interface EtiquetaInterface {
  etiqueta_id: string;
  nombre: string;
  esta_activo: boolean;
  productosEtiquetas: ProductosEtiquetas[];
}
