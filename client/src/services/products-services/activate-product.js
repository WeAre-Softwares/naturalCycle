import axios from 'axios';
import { API_URL } from '../constants/api-url.contant';
import { handleAxiosError } from './errorHandler';

export const activateProductService = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/productos/activate/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
