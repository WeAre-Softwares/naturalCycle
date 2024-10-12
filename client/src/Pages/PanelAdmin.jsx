import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Panel/styles.css';
import '../Styles/Panel/PanelAdministracion.css';

export const PanelAdmin = () => {
  return (
    <div className="div-superior-panel-admin">
      <div className="panel-admin">
        <nav className="menu-lateral">
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
      </div>
    </div>
  );
};
