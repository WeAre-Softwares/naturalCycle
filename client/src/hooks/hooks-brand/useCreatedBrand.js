import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { createBrandService } from '../../services/marca-services/create-brand';
import useAuthStore from '../../store/use-auth-store';

export const useCreateBrand = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Extrear el JWT del localStorage usando el estado global
  const { token } = useAuthStore();

  const createBrand = async (formData) => {
    setLoading(true);
    try {
      await createBrandService(token, formData);
      toast.success('Marca creada con éxito!');
      setTimeout(() => {
        navigate('/panel-filtrado');
      }, 2000);
    } catch (error) {
      toast.error('Error al crear la marca');
    } finally {
      setLoading(false);
    }
  };

  return { createBrand, loading };
};
