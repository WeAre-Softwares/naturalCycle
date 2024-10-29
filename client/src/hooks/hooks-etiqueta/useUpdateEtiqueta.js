import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/use-auth-store';
import { updateEtiquetaService } from '../../services/etiquetas-service/update-etiqueta';

export const useUpdateEtiqueta = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Extrear el JWT del localStorage usando el estado global
  const { token } = useAuthStore();

  const UpdateEtiqueta = async (etiqueta_id, data) => {
    setLoading(true);
    try {
      await updateEtiquetaService(token, etiqueta_id, data);
      toast.success('Etiqueta actualizada con éxito!');
      setTimeout(() => {
        navigate('/panel-principal');
      }, 3000);
    } catch (error) {
      toast.error('Error al actualizar la etiqueta');
    } finally {
      setLoading(false);
    }
  };

  return { UpdateEtiqueta, loading };
};
