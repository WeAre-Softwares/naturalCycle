import axios from 'axios';
import { API_URL } from '../constants/api-url.contant';
import { handleAxiosError } from './errorHandler';

export const updateProductService = async (
  id,
  nombre,
  descripcion,
  precio,
  tipo_de_precio,
  esta_activo,
  en_promocion,
  producto_destacado,
  marca_id,
  productos_etiquetas,
  productos_categorias,
  imagenes,
) => {
  try {
    const response = await axios.patch(`${API_URL}/productos/${id}`, {
      nombre,
      descripcion,
      precio,
      tipo_de_precio,
      esta_activo,
      en_promocion,
      producto_destacado,
      marca_id,
      productos_etiquetas,
      productos_categorias,
      imagenes,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
