import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/use-auth-store';
import { darDeAltaUsuarioService } from '../../services/users-services/dar-de-alta-usuario';

export const useDarDeAltaUsuario = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useAuthStore();

  const darDeAltaUsuario = async (usuario_id) => {
    setLoading(true);
    setError(null);

    try {
      await darDeAltaUsuarioService(usuario_id, token);
      toast.success('Usuario dado de alta con éxito!');
      setTimeout(() => {
        navigate('/panel-principal');
      }, 2500);
    } catch (err) {
      toast.error('Error al dar de alta al usuario');
      setError(err.message || 'Error al dar de alta al usuario.');
    } finally {
      setLoading(false);
    }
  };

  return { darDeAltaUsuario, loading };
};
