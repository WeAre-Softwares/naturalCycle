export const handleAxiosError = (error) => {
  if (error.response) {
    console.error('Error en la respuesta del servidor:', error.response.data);
    throw new Error(error.response.data.message || 'Error en la solicitud.');
  } else if (error.request) {
    console.error('No hubo respuesta del servidor:', error.request);
    throw new Error('No hubo respuesta del servidor. Intenta de nuevo.');
  } else {
    console.error('Error al configurar la solicitud:', error.message);
    throw new Error('Error de red o de servidor. Intenta de nuevo.');
  }
};
