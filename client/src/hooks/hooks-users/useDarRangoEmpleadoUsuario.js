import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/use-auth-store';
import { darRangoEmpleadoUsuarioService } from '../../services/users-services/dar-rango-empleado';

export const useDarRangoEmpleadoUsuario = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useAuthStore();

  const darRangoEmpleadoUsuario = async (usuario_id) => {
    setLoading(true);
    setError(null);

    try {
      await darRangoEmpleadoUsuarioService(usuario_id, token);
      toast.success('Se le asigno correctamente el rol de: Empleado!');
      setTimeout(() => {
        navigate('/panel-principal');
      }, 2500);
    } catch (err) {
      toast.error('Error al darle rol de empleado al usuario');
      setError(err.message || 'Error al darle rol empleado al usuario.');
    } finally {
      setLoading(false);
    }
  };

  return { darRangoEmpleadoUsuario, loading };
};
