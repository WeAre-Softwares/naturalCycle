import axios from "axios"
import { API_URL } from "../constants/api-url.contant"
import { handleAxiosError } from "./errorHandler"
export const useGetPedidosGananciasPorMes = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/pedidos/ganancia-mes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}
