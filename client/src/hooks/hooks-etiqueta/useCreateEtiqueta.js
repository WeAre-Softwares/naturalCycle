import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { createEtiquetaService } from '../../services/etiquetas-service/create-etiqueta';
import useAuthStore from '../../store/use-auth-store';

export const useCreateEtiqueta = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Extrear el JWT del localStorage usando el estado global
  const { token } = useAuthStore();

  const createEtiqueta = async (data) => {
    setLoading(true);
    try {
      await createEtiquetaService(token, data);
      toast.success('Etiqueta creada con éxito!');
      setTimeout(() => {
        navigate('/panel-principal');
      }, 2000);
    } catch (error) {
      toast.error('Error al crear la etiqueta');
    } finally {
      setLoading(false);
    }
  };

  return { createEtiqueta, loading };
};
