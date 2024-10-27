import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/use-auth-store';

// Componente de protección para rutas privadas (solo accesible si el usuario es admin)
export const PrivateRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const getRoles = useAuthStore((state) => state.getRoles);

  // Verificar si el usuario tiene el rol 'admin'
  const isAdmin = getRoles().includes('admin');

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/inicio" replace />;
  }

  return <Element {...rest} />;
};
