import axios from 'axios';
import { API_URL } from '../../constants/api-url.contant';
import { handleAxiosError } from '../errorHandler';

export const deactivateBrandService = async (marca_id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/marcas/${marca_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
