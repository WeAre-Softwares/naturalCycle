import axios from 'axios';
import { API_URL } from '../../constants/api-url.contant';
import { handleAxiosError } from '../errorHandler';

export const getPedidoByIdService = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/pedido/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
