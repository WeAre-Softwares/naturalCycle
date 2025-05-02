import axios from 'axios';
import { handleAxiosError } from '../errorHandler';
import { API_URL } from '../../constants/api-url.contant';
import useAuthStore from '../../store/use-auth-store';

export const crearPedido = async (detalles, usuarioId) => {
  try {
    const { token } = useAuthStore.getState();

    const response = await axios.post(
      `${API_URL}/pedidos`,
      { usuarioId, detalles },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    handleAxiosError(error);
  }
};

export const crearPedidoAdmin = async (detalles, usuarioId) => {
  try {
    const { token } = useAuthStore.getState();

    const response = await axios.post(
      `${API_URL}/pedidos/adminPedidos?usuarioId=${usuarioId}`,
      { detalles },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    handleAxiosError(error);
  }
};