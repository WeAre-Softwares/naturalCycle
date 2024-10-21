import axios from 'axios';
import { handleAxiosError } from '../errorHandler';
import { API_URL } from '../../constants/api-url.contant';

export const createProductService = async (token, formData) => {
  try {
    const response = await axios.post(`${API_URL}/productos`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
