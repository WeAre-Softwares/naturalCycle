import axios from 'axios';
import { API_URL } from '../../constants/api-url.contant';
import { handleAxiosError } from '../errorHandler';

export const getUserByIdService = async (token, id) => {
  try {
    const response = await axios.get(`${API_URL}/usuarios/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
