import { API_URL } from "../constants/api-url.contant";
import axios from "axios";
import { handleAxiosError } from "./errorHandler";

export const updateNotificacion = async (type) => {
  try {
    const response = await axios.put(`${API_URL}/notificaciones/${type}`);
    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}