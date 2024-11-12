import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/use-auth-store';
import { activateCategoryService } from '../../services/categoria-services/activate-category';

export const useActivateCategory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthStore();

  const activateCategory = async (categoria_id) => {
    setIsLoading(true);
    try {
      const response = await activateCategoryService(categoria_id, token);
      toast.success(response.mensaje || 'Categoría activada con éxito');
      setTimeout(() => {
        navigate('/panel-principal');
      }, 2000);
      return true;
    } catch (error) {
      toast.error(error.message || 'Error al activar la categoría');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { activateCategory, isLoading };
};
