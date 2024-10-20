import axios from 'axios';
import { API_URL } from '../constants/api-url.contant';
import { handleAxiosError } from './errorHandler';

export const activateProductService = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/productos/activate/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
