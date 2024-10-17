import axios from 'axios';
import { API_URL } from '../constants/api-url.contant';
import { handleAxiosError } from './errorHandler';

export const ResetPasswordService = async (newPassword, token) => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      newPassword,
      token,
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
