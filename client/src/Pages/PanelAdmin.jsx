import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Panel/styles.css';
import '../Styles/Panel/PanelAdministracion.css';

export const PanelAdmin = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isPanelRoute = location.pathname === "/Panel";

  return (
    <div className="div-superior-panel-admin">
      <div className={isPanelRoute ? "div-superior-panel-admin2" : ""}></div>
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
            <Link to="/panelpedidos">Área de Pedidos</Link>
          </li>
          <li>
            <Link to="/panelusuarios">Área de Usuarios</Link>
          </li>
          <li>
            <Link to="/panelfiltrado">Crear Filtrado</Link>
          </li>
          <li>
            <Link to="/panelproducto">Crear Producto</Link>
          </li>
          <li>
            <Link to="/panelpermisos">Permisos</Link>
          </li>
        </ul>
      </nav>

      <div className={`panel-admin ${menuOpen ? 'panel-admin-open' : ''}`}>
        {/* Contenido del panel de administración aquí */}
      </div>
    </div>
  );
};