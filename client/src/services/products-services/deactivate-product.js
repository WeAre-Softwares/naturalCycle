import axios from 'axios';
import { API_URL } from '../../constants/api-url.contant';
import { handleAxiosError } from '../errorHandler';

export const deactivateProductService = async (producto_id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/productos/${producto_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
