import axios from 'axios';
import { handleAxiosError } from '../errorHandler';
import { API_URL } from '../../constants/api-url.contant';

export const createProductService = async (
  nombre,
  descripcion,
  precio,
  tipo_de_precio,
  en_promocion,
  producto_destacado,
  marca_id,
  productos_etiquetas,
  productos_categorias,
  imagenes,
) => {
  try {
    const response = await axios.post(`${API_URL}/productos`, {
      nombre,
      descripcion,
      precio,
      tipo_de_precio,
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
