import axios from "axios"
import { API_URL } from "../constants/api-url.contant"
import { handleAxiosError } from "./errorHandler"
export const getCategoriasMasVendidas = async (token, rango) => {
  try {
    const response = await axios.get(`${API_URL}/detalles-pedidos/productos-mas-vendidos/${rango}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}
