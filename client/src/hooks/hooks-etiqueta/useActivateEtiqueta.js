import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/use-auth-store';
import { activateEtiquetaService } from '../../services/etiquetas-service/activate-etiqueta';

export const useActivateEtiqueta = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthStore();

  const activateEtiqueta = async (etiqueta_id) => {
    setIsLoading(true);
    try {
      const response = await activateEtiquetaService(etiqueta_id, token);
      toast.success(response.mensaje || 'Etiqueta activada con éxito');
      setTimeout(() => {
        navigate('/panel-principal');
      }, 2000);
      return true;
    } catch (error) {
      toast.error(error.message || 'Error al activar la etiqueta');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { activateEtiqueta, isLoading };
};
