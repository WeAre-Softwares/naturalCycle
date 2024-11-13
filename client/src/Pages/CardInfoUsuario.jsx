import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/CardUsuario/CardInfoUsuario.css';
import useAuthStore from '../store/use-auth-store';
import { useGetUserById } from '../hooks/hooks-users/useGetUserById';
import { NoHayUsuario } from '../Components/NoHayUsuario';

export const CardInfoUsuario = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const { user, error, loading } = useGetUserById();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <section className="dots-container-inicio">
        <div className="dot-inicio"></div>
        <div className="dot-inicio"></div>
        <div className="dot-inicio"></div>
        <div className="dot-inicio"></div>
        <div className="dot-inicio"></div>
      </section>
    );
  }

  return (
    <div className="container-card-info-usuario">
      {user ? (
        <>
          <h2 className="h2-card-info-usuario">Datos de usuario</h2>
          <div className="container-datos-usuario-card">
            <i className="fa-solid fa-user"></i>
            <p>Nombre: {user?.nombre}</p>
            <p>Apellido: {user?.apellido}</p>
            <p>DNI: {user?.dni}</p>
            <p>Nombre del comercio: {user?.nombre_comercio}</p>
            <p>Teléfono: {user?.telefono}</p>
            <p>Email: {user?.email}</p>
          </div>
          <button className="Btn-cerrar-sesion" onClick={handleLogout}>
            <div className="sign-cerrar-sesion">
              <svg viewBox="0 0 512 512">
                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
              </svg>
            </div>
            <h3>Cerrar sesión</h3>
          </button>
        </>
      ) : (
        error && <NoHayUsuario />
      )}
    </div>
  );
};
