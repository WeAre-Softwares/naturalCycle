import axios from 'axios';
import { API_URL } from '../../constants/api-url.contant';
import { handleAxiosError } from '../errorHandler';

export const getPedidoRemitoService = async (pedidoId, token) => {
  try {
    const response = await axios.get(`${API_URL}/remitos/pdf/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob', // Importante para manejar el PDF como un Blob
      params: { pedidoId },
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `remito_${pedidoId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    handleAxiosError(error);
  }
};
