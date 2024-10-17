import axios from 'axios';
import { API_URL } from '../constants/api-url.contant';
import { handleAxiosError } from './errorHandler';

export const registerService = async (
  nombre,
  apellido,
  dni,
  nombre_comercio,
  telefono,
  dom_fiscal,
  email,
  password,
) => {
  try {
    const response = await axios.post(`${API_URL}/usuarios`, {
      nombre,
      apellido,
      dni,
      nombre_comercio,
      telefono,
      dom_fiscal,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
