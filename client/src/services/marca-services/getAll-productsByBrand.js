import axios from 'axios';
import { API_URL } from '../../constants/api-url.contant';
import { handleAxiosError } from '../errorHandler';

export const getAllProductsByBrandService = async (
  filter,
  limit = 10,
  offset = 0,
) => {
  try {
    const response = await axios.get(`${API_URL}/productos/marca/${filter}`, {
      params: {
        limit,
        offset,
      },
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
