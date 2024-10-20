import axios from 'axios';
import { API_URL } from '../constants/api-url.contant';
import { handleAxiosError } from './errorHandler';

export const getAllProductsService = async (limit = 10, offset = 0) => {
  try {
    const response = await axios.get(`${API_URL}/productos`, {
      params: {
        limit,
        offset,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
