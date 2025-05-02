import axios from 'axios';
import { API_URL } from '../../constants/api-url.contant';
import { handleAxiosError } from '../errorHandler';

export const deactivateCategoryService = async (categoria_id, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/categorias/${categoria_id}`,
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
