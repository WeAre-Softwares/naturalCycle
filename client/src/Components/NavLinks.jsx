import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/use-auth-store';

export const NavLinks = ({ isOpen, toggleMenu }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const getRoles = useAuthStore((state) => state.getRoles);
  const navigate = useNavigate();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Verificar si el usuario tiene el rol 'admin' o 'empleado'
  const hasAccess =
    isAuthenticated() &&
    (getRoles().includes('admin') || getRoles().includes('empleado'));

  const handleLogout = () => {
    logout();
    setShouldRedirect(true); // Activar la redirección solo después de hacer logout
  };

  useEffect(() => {
    if (shouldRedirect && !isAuthenticated()) {
      navigate('/login');
      setShouldRedirect(false); // Resetear para evitar redirección continua
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
            {hasAccess && (
              <li>
                <Link to="/panel-principal" onClick={toggleMenu}>
                  Panel Administrador
                </Link>
              </li>
            )}
            <li>
              <Link onClick={handleLogout}>Cerrar sesión</Link> {/*cambiar este link por el comentado de abajo y este ponerlo EN LA PÁGINA 
              CardInfoUsuario (ahi en la pagina está comentado donde agregarlo) */}
            </li> 

            {/*<Link to="/CardInfoUsuario">
        <p name="nombre-usuario-login">Mi cuenta</p>
      </Link>*/}

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
