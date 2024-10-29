import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/use-auth-store';
import { updateBrandService } from '../../services/marca-services/update-brand';

export const useUpdateBrand = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Extrear el JWT del localStorage usando el estado global
  const { token } = useAuthStore();

  const updateBrand = async (marca_id, formData) => {
    setLoading(true);
    try {
      await updateBrandService(token, marca_id, formData);
      toast.success('Marca Actualizada con éxito!');
      setTimeout(() => {
        navigate('/panel-principal');
      }, 3000);
    } catch (error) {
      toast.error('Error al actualizar la marca');
    } finally {
      setLoading(false);
    }
  };

  return { updateBrand, loading };
};
