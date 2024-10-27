import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/use-auth-store';

export const NavLinks = ({ isOpen, toggleMenu }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // Obtener el usuario desde el estado global
  const logout = useAuthStore((state) => state.logout);
  const getRoles = useAuthStore((state) => state.getRoles);
  const navigate = useNavigate();

  // Verificar si el usuario tiene el rol 'admin'
  const isAdmin = getRoles().includes('admin');

  const handleLogout = () => {
    logout();
    navigate('/Inicio');
  };

  return (
    <div className={`links-header ${isOpen ? 'open' : ''}`}>
      <button className="close-menu" onClick={toggleMenu}>
        <i className="fa-solid fa-backward-step"> M e n u</i>
      </button>
      <ul className="ul-menu-hamb">
        <li>
          <Link to="/inicio" onClick={toggleMenu}>
            Inicio
          </Link>
        </li>
        <li>
          <Link
            to="/categorias"
            className="link-categorias"
            onClick={toggleMenu}
          >
            Categorías
          </Link>
        </li>
        <li>
          <Link to="/marcas" className="link-marcas" onClick={toggleMenu}>
            Marcas
          </Link>
        </li>

        <li>
          <Link to="/promociones" onClick={toggleMenu}>
            Promociones
          </Link>
        </li>
        <li>
          <Link to="/nuevos-ingresos" onClick={toggleMenu}>
            Nuevos ingresos
          </Link>
        </li>
        <li>
          <Link to="/about" onClick={toggleMenu}>
            Sobre nosotros
          </Link>
        </li>
        {isAuthenticated() ? (
          <>
            {isAdmin && ( // Solo mostrar para administradores
              <li>
                <Link to="/panel-principal" onClick={toggleMenu}>
                  Panel Administrador
                </Link>
              </li>
            )}
            <li>
              <Link onClick={handleLogout}>Cerrar sesión</Link>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login" onClick={toggleMenu}>
              Iniciar sesión
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};
