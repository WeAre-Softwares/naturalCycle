import axios from "axios"
import { API_URL } from "../constants/api-url.contant"
import { handleAxiosError } from "./errorHandler"

export const getUsuariosNotificaciones = async () => {
  try {
    const response = await axios(`${API_URL}/notificaciones/usuario`)
    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}
