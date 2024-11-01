import axios from 'axios';
import { API_URL } from '../../constants/api-url.contant';
import { handleAxiosError } from '../errorHandler';

export const activateProductService = async (producto_id, token) => {
  try {
    const response = await axios.patch(
      `${API_URL}/productos/activate/${producto_id}`,
      {}, // Este segundo parámetro es el cuerpo de la petición. Si no necesitas enviar datos en el cuerpo, mantenlo vacío.
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
