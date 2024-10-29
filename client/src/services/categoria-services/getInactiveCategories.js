import axios from 'axios';
import { API_URL } from '../../constants/api-url.contant';
import { handleAxiosError } from '../errorHandler';

export const getInactiveCategoriesService = async (
  limit = 10,
  offset = 0,
  token,
) => {
  try {
    const response = await axios.get(`${API_URL}/categorias/inactivos`, {
      params: {
        limit,
        offset,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
