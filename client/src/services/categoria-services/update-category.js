import axios from 'axios';
import { API_URL } from '../../constants/api-url.contant';
import { handleAxiosError } from '../errorHandler';

export const updateCategoryService = async (token, categoria_id, data) => {
  try {
    const response = await axios.patch(
      `${API_URL}/categorias/${categoria_id}`,
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
