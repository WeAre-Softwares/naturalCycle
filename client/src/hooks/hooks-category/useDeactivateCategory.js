import { useState } from 'react';
import { toast } from 'react-toastify';
import { deactivateCategoryService } from '../../services/categoria-services/deactivate-category';
import useAuthStore from '../../store/use-auth-store';

export const useDeactivateCategory = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Extrear el JWT del localStorage usando el estado global
  const { token } = useAuthStore();

  const deactivateCategory = async (categoria_id) => {
    setIsLoading(true);
    try {
      const response = await deactivateCategoryService(categoria_id, token);
      toast.success(response.mensaje || 'Categoría desactivada con éxito');
      return true;
    } catch (error) {
      toast.error(response.mensaje || 'Error al desactivar la categoría');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deactivateCategory, isLoading };
};
