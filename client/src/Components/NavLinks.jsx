import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/use-auth-store';
import useMarca from '../context/marcas/useMarcaContext';
import useCategoria from '../context/categorias/useCategoriasContext';
import useGetNotifications from '../hooks/useGetNotifications';

export const NavLinks = ({ isOpen, toggleMenu }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const getRoles = useAuthStore((state) => state.getRoles);
  const navigate = useNavigate();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { setSidebarOpen: setSidebarOpenMarcas } = useMarca()
  const { setSidebarOpen: setSidebarOpenCategorias } = useCategoria()

  const handleMarcas = () => {
    setSidebarOpenMarcas(true)
    toggleMenu()
  }

  const handleCategorias = () => {
    setSidebarOpenCategorias(true)
    toggleMenu()
  }

  const hasAccess =
    isAuthenticated() &&
    (getRoles().includes('admin') || getRoles().includes('empleado'));

  const { data, loading, error } = useGetNotifications(hasAccess)

  const handleNotifications = () => {
    if (!loading && !error) {
      if (data.length > 0) {
        for (const notification of data) {
          if (notification.esta_activo) {
            return true
          }
        }
      }
    }

    return false
  };

  useEffect(() => {
    if (shouldRedirect && !isAuthenticated()) {
      navigate('/login');
      setShouldRedirect(false); 
    }
  }, [shouldRedirect, isAuthenticated, navigate]);

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
            onClick={handleCategorias}
          >
            Categorías
          </Link>
        </li>
        <li>
          <Link to="/marcas" className="link-marcas" onClick={handleMarcas}>
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
          <Link to="/productos-por-bulto-cerrado" onClick={toggleMenu}>
            Bulto cerrado
          </Link>
        </li>
        <li>
          <Link to="/about" onClick={toggleMenu}>
            Sobre nosotros
          </Link>
        </li>
        {isAuthenticated() ? (
          <>
            <li>
              <Link to="/usuario-info" onClick={toggleMenu}>
                <span name="nombre-usuario-login">Mi cuenta</span>
              </Link>
            </li>
            {hasAccess && (
              <li>
                <Link to="/panel-principal" onClick={toggleMenu}>
                  Panel Administrador
                  { handleNotifications() && <i className="fa-solid fa-bell" style={{ paddingLeft: '5px', color: 'rgb(199, 0, 57)'}}></i>}
                </Link>
              </li>
            )}
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
