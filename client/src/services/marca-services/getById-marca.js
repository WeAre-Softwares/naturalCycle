import axios from 'axios';
import { API_URL } from '../../constants/api-url.contant';
import { handleAxiosError } from '../errorHandler';

export const getMarcaByIdService = async (marca_id) => {
  try {
    const response = await axios.get(`${API_URL}/marcas/${marca_id}`);

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
