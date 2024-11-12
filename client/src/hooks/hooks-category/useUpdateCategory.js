import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { updateCategoryService } from '../../services/categoria-services/update-category';
import useAuthStore from '../../store/use-auth-store';

export const useUpdateCategory = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Extrear el JWT del localStorage usando el estado global
  const { token } = useAuthStore();

  const UpdateCategory = async (categoria_id, data) => {
    setLoading(true);
    try {
      await updateCategoryService(token, categoria_id, data);
      toast.success('Categoría actualizada con éxito!');
      setTimeout(() => {
        navigate('/panel-principal');
      }, 2000);
    } catch (error) {
      toast.error('Error al actualizar la categoría');
    } finally {
      setLoading(false);
    }
  };

  return { UpdateCategory, loading };
};
