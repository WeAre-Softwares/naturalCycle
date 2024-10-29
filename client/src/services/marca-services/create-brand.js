import axios from 'axios';
import { handleAxiosError } from '../errorHandler';
import { API_URL } from '../../constants/api-url.contant';

export const createBrandService = async (token, formData) => {
  try {
    const response = await axios.post(`${API_URL}/marcas`, formData, {
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
