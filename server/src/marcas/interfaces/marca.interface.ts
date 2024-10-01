import { Producto } from '../../productos/entities/producto.entity';

export interface MarcaInterface {
  marca_id: string;
  nombre: string;
  marca_destacada: boolean;
  imagen_url: string;
  public_id: string;
  esta_activo: boolean;
  productos: Producto[];
}
