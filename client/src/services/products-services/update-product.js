import axios from 'axios';
import { API_URL } from '../../constants/api-url.contant';
import { handleAxiosError } from '../errorHandler';

export const updateProductService = async (token, id, formData) => {
  try {
    const response = await axios.patch(`${API_URL}/productos/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
