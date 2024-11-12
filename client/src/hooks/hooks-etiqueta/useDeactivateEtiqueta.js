import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deactivateEtiquetaService } from '../../services/etiquetas-service/deactivate-etiqueta';
import useAuthStore from '../../store/use-auth-store';

export const useDeactivateEtiqueta = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Extrear el JWT del localStorage usando el estado global
  const { token } = useAuthStore();

  const deactivateEtiqueta = async (etiqueta_id) => {
    setIsLoading(true);
    try {
      const response = await deactivateEtiquetaService(etiqueta_id, token);
      toast.success(response.mensaje || 'Etiqueta desactivada con éxito');
      setTimeout(() => {
        navigate('/panel-principal');
      }, 2000);
      return true;
    } catch (error) {
      toast.error(response.mensaje || 'Error al desactivar la etiqueta');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deactivateEtiqueta, isLoading };
};
