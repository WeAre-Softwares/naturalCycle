import axios from 'axios';
import { API_URL } from '../../constants/api-url.contant';
import { handleAxiosError } from '../errorHandler';

export const updateBrandService = async (token, id, formData) => {
  try {
    const response = await axios.patch(`${API_URL}/marcas/${id}`, formData, {
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
