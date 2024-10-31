import axios from 'axios';
import { API_URL } from '../../constants/api-url.contant';
import { handleAxiosError } from '../errorHandler';

export const searchUsersService = async (
  term = '',
  limit = 10,
  offset = 0,
  token,
) => {
  try {
    const response = await axios.get(`${API_URL}/usuarios/search`, {
      params: {
        term,
        limit,
        offset,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
