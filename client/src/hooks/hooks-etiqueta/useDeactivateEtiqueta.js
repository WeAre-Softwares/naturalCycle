import { useState } from 'react';
import { toast } from 'react-toastify';
import { deactivateEtiquetaService } from '../../services/etiquetas-service/deactivate-etiqueta';
import useAuthStore from '../../store/use-auth-store';

export const useDeactivateEtiqueta = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Extrear el JWT del localStorage usando el estado global
  const { token } = useAuthStore();

  const deactivateEtiqueta = async (etiqueta_id) => {
    setIsLoading(true);
    try {
      const response = await deactivateEtiquetaService(etiqueta_id, token);
      toast.success(response.mensaje || 'Etiqueta desactivada con éxito');
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
