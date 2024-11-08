import axios from 'axios';
import { API_URL } from '../../constants/api-url.contant';
import { handleAxiosError } from '../errorHandler';

export const getDetallePedidoByIdService = async (token, pedidoId) => {
  try {
    const response = await axios.get(
      `${API_URL}/detalles-pedidos/pedido/${pedidoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
