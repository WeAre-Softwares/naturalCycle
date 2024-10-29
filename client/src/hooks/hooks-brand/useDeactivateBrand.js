import { useState } from 'react';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/use-auth-store';
import { deactivateBrandService } from '../../services/marca-services/deactivate-brand';

export const useDeactivateBrand = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Extrear el JWT del localStorage usando el estado global
  const { token } = useAuthStore();

  const deactivateBrand = async (marca_id) => {
    setIsLoading(true);
    try {
      const response = await deactivateBrandService(marca_id, token);
      toast.success(response.mensaje || 'Marca desactivada con éxito');
      return true;
    } catch (error) {
      toast.error(error.message || 'Error al desactivar la marca');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deactivateBrand, isLoading };
};
