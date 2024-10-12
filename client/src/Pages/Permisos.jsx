import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Permisos = () => {
  const [permisos, setPermisos] = useState({
    verificarUsuarios: false,
    editarPedidos: false,
    crearBorrarFiltrado: false,
    cargarEliminarProductos: false,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setPermisos((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="div-general-categoria-panel">
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
      <div className="permissions-container">
        <h1 className="permissions-header">Asignar Permisos</h1>
        <div className="permissions-checkbox-group">
          <label className="permissions-checkbox-label">
            <input
              type="checkbox"
              name="verificarUsuarios"
              className="permissions-checkbox-input"
              checked={permisos.verificarUsuarios}
              onChange={handleChange}
            />
            Verificar y dar de baja usuarios
          </label>
          <label className="permissions-checkbox-label">
            <input
              type="checkbox"
              name="editarPedidos"
              className="permissions-checkbox-input"
              checked={permisos.editarPedidos}
              onChange={handleChange}
            />
            Editar o cambiar el estado de pedidos
          </label>
          <label className="permissions-checkbox-label">
            <input
              type="checkbox"
              name="crearBorrarFiltrado"
              className="permissions-checkbox-input"
              checked={permisos.crearBorrarFiltrado}
              onChange={handleChange}
            />
            Crear/borrar filtrado
          </label>
          <label className="permissions-checkbox-label">
            <input
              type="checkbox"
              name="cargarEliminarProductos"
              className="permissions-checkbox-input"
              checked={permisos.cargarEliminarProductos}
              onChange={handleChange}
            />
            Cargar/eliminar productos
          </label>
        </div>
      </div>
    </div>
  );
};
