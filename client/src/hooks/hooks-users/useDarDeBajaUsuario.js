import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/use-auth-store';
import { darDeBajaUsuarioService } from '../../services/users-services/dar-de-baja-usuario';

export const useDarDeBajaUsuario = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useAuthStore();

  const darDeBajaUsuario = async (usuario_id) => {
    setLoading(true);
    setError(null);

    try {
      await darDeBajaUsuarioService(usuario_id, token);
      toast.success('Usuario dado de baja con éxito!');
      setTimeout(() => {
        navigate('/panel-principal');
      }, 3000);
    } catch (err) {
      toast.error('Error al dar de baja al usuario');
      setError(err.message || 'Error al dar de baja al usuario.');
    } finally {
      setLoading(false);
    }
  };

  return { darDeBajaUsuario, loading };
};
