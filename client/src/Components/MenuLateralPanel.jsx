import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Panel/styles.css';
import '../Styles/Panel/PanelAdministracion.css';

export const MenuLateralPanel = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isPanelRoute = location.pathname === '/Panel';

  return (
    <div className="div-superior-panel-admin">
      <div className={isPanelRoute ? 'div-superior-panel-admin2' : ''}></div>
      <button className="menu-toggle-btn" onClick={toggleMenu}>
        Menú
      </button>

      <nav className={`menu-lateral ${menuOpen ? 'menu-lateral-open' : ''}`}>
        <button className="close-btn" onClick={toggleMenu}>
          &times; {/* Este es el símbolo "X" */}
        </button>
        <h2>Menú</h2>
        <ul>
          <li>
            <Link to="/panel-pedidos">Área de Pedidos</Link>
          </li>
          <li>
            <Link to="/panel-usuarios">Área de Usuarios</Link>
          </li>
          <li>
            <Link to="/panel-filtrado">Crear Filtrado</Link>
          </li>
          <li>
            <Link to="/panel-producto">Crear Producto</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
