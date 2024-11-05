import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/use-auth-store';

const ProtectedRoute = ({ element: Component }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Si el usuario está autenticado, redirige a inicio
  return isAuthenticated() ? <Navigate to="/inicio" replace /> : <Component />;
};

export default ProtectedRoute;
