import axios from 'axios';
import { API_URL } from '../constants/api-url.contant';
import { handleAxiosError } from './errorHandler';

export const activateCategoryService = async (categoria_id, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/categorias/activate/${categoria_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
