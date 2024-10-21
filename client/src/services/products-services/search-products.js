import axios from 'axios';
import { API_URL } from '../../constants/api-url.contant';
import { handleAxiosError } from '../errorHandler';

export const searchProductsService = async (
  term = '',
  limit = 10,
  offset = 0,
) => {
  try {
    const response = await axios.get(`${API_URL}/productos/search`, {
      params: {
        term,
        limit,
        offset,
      },
    });

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
