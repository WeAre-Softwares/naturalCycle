import axios from 'axios';
import { API_URL } from '../../constants/api-url.contant';
import { handleAxiosError } from '../errorHandler';

export const actualizarEstadoPedido = async (token, id, nuevoEstado) => {
  try {
    const response = await axios.patch(
      `${API_URL}/pedidos/${id}/estado`,
      { estado_pedido: nuevoEstado }, // Cuerpo de la petición
      {
        // Configuración de headers
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
