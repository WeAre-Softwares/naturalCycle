import React, { useState, useEffect } from 'react';
import { MenuLateralPanel } from '../Components/MenuLateralPanel';

export const Permisos = () => {
  // Función para obtener permisos del localStorage o establecer valores por defecto
  const getStoredPermisos = () => {
    const storedPermisos = localStorage.getItem('permisos');
    return storedPermisos
      ? JSON.parse(storedPermisos)
      : {
          verificarUsuarios: false,
          editarPedidos: false,
          crearBorrarFiltrado: false,
          cargarEliminarProductos: false,
        };
  };

  const [permisos, setPermisos] = useState(getStoredPermisos);

  // Actualiza localStorage cuando cambian los permisos
  useEffect(() => {
    localStorage.setItem('permisos', JSON.stringify(permisos));
  }, [permisos]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setPermisos((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="div-general-categoria-panel">
        <MenuLateralPanel />

      <div className="permissions-container">
      <input
            type="text"
            placeholder="Buscar usuario"
            className="buscar-producto-input"
          />
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
