import axios from 'axios';
import { API_URL } from '../../constants/api-url.contant';
import { handleAxiosError } from '../errorHandler';

export const updateEtiquetaService = async (token, etiqueta_id, data) => {
  try {
    const response = await axios.patch(
      `${API_URL}/etiquetas/${etiqueta_id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
