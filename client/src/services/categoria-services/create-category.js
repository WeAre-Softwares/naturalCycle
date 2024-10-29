import axios from 'axios';
import { handleAxiosError } from '../errorHandler';
import { API_URL } from '../../constants/api-url.contant';

export const createCategoryService = async (token, data) => {
  try {
    const response = await axios.post(`${API_URL}/categorias`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
