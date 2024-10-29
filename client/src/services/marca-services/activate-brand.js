import axios from 'axios';
import { API_URL } from '../../constants/api-url.contant';
import { handleAxiosError } from '../errorHandler';

export const activateBrandService = async (marca_id, token) => {
  try {
    const response = await axios.patch(
      `${API_URL}/marcas/activate/${marca_id}`,
      {}, // Este objeto puede estar vacío si no necesitas enviar un cuerpo
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
