import axios from 'axios';
import { API_URL } from '../../constants/api-url.contant';
import { handleAxiosError } from '../errorHandler';

export const getAllProductsByBultoCerrado = async (limit = 10, offset = 0) => {
  try {
    const response = await axios.get(`${API_URL}/productos/bultocerrado`, {
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
