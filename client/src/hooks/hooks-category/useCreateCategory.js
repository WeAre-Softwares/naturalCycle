import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { createCategoryService } from '../../services/categoria-services/create-category';
import useAuthStore from '../../store/use-auth-store';

export const useCreateCategory = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Extrear el JWT del localStorage usando el estado global
  const { token } = useAuthStore();

  const createCategory = async (data) => {
    setLoading(true);
    try {
      await createCategoryService(token, data);
      toast.success('Categoría creada con éxito!');
      setTimeout(() => {
        navigate('/panel-principal');
      }, 3000);
    } catch (error) {
      toast.error('Error al crear la categoría');
    } finally {
      setLoading(false);
    }
  };

  return { createCategory, loading };
};
