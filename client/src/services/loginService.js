import axios from 'axios';
import { API_URL } from '../constants/api-url.contant';
import { handleAxiosError } from './errorHandler';

export const loginService = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
