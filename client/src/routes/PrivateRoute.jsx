import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/use-auth-store';

// Componente de protección para rutas privadas (solo accesible si el usuario es admin o empleado)
export const PrivateRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const getRoles = useAuthStore((state) => state.getRoles);

  // Verificar si el usuario tiene el rol 'admin' o 'empleado'
  const hasAccess =
    isAuthenticated() &&
    (getRoles().includes('admin') || getRoles().includes('empleado'));

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAccess) {
    return <Navigate to="/inicio" replace />;
  }

  return <Element {...rest} />;
};
