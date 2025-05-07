import axios from "axios";
import { API_URL } from "../../constants/api-url.contant";
import { handleAxiosError } from "../errorHandler";
import useAuthStore from "../../store/use-auth-store";

const editarPedido = async (pedido_id, data) => {
  const { token } = useAuthStore.getState();

  if (!token) return 'No token provided'

  try {
    const response = await axios.patch(
      `${API_URL}/pedidos/${pedido_id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data
  } catch (error) {
    handleAxiosError(error);
  }
}

export default editarPedido