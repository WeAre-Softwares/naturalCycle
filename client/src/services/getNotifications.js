import axios from "axios";
import { API_URL } from "../constants/api-url.contant";
import { handleAxiosError } from "./errorHandler";

export const getNotifications = async () => {
  try {
    const response = await axios(`${API_URL}/notificaciones`)
    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}