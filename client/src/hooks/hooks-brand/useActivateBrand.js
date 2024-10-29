import { useState } from 'react';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/use-auth-store';
import { activateBrandService } from '../../services/marca-services/activate-brand';

export const useActivateBrand = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthStore();

  const activateBrand = async (marca_id) => {
    setIsLoading(true);
    try {
      const response = await activateBrandService(marca_id, token);
      toast.success(response.mensaje || 'Marca activada con éxito');
      return true;
    } catch (error) {
      toast.error(error.message || 'Error al activar la marca');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { activateBrand, isLoading };
};
