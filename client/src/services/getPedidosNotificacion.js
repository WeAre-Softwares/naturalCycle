import axios from "axios"
import { API_URL } from "../constants/api-url.contant"
import { handleAxiosError } from "./errorHandler"

export const getPedidosNotificacion = async () => {
  try {
    const response = await axios(`${API_URL}/notificaciones/pedido`)
    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}
