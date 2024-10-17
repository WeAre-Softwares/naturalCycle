import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const loginService = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
