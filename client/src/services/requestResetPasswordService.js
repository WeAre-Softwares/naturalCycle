import axios from 'axios';
import { API_URL } from '../constants/api-url.contant';
import { handleAxiosError } from './errorHandler';

export const requestResetPasswordService = async (email) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/request-password-reset`,
      {
        email,
      },
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
