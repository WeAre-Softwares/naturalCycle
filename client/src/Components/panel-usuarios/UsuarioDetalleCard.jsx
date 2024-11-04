import React from 'react';

export const UsuarioDetalleCard = ({
  usuarioSeleccionado,
  cerrarDetallesUsuario,
}) => {
  return (
    <div className="usuario-detalle-card">
      <h2 className="usuario-detalle-title">Detalles del Usuario</h2>
      <div className="usuario-detalle-info">
        <div className="usuario-detalle-row">
          <strong>Nombre Completo:</strong>{' '}
          <span>
            {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}
          </span>
        </div>
        <div className="usuario-detalle-row">
          <strong>DNI:</strong> <span>{usuarioSeleccionado.dni}</span>
        </div>
        <div className="usuario-detalle-row">
          <strong>Teléfono:</strong> <span>{usuarioSeleccionado.telefono}</span>
        </div>
        <div className="usuario-detalle-row">
          <strong>Nombre del Comercio:</strong>{' '}
          <span>{usuarioSeleccionado.nombre_comercio}</span>
        </div>
        <div className="usuario-detalle-row">
          <strong>Domicilio Fiscal del Comercio:</strong>{' '}
          <span>{usuarioSeleccionado.dom_fiscal}</span>
        </div>
        <div className="usuario-detalle-row">
          <strong>Email:</strong> <span>{usuarioSeleccionado.email}</span>
        </div>
        <div className="usuario-detalle-row">
          <strong>Estado:</strong>{' '}
          <span
            className={
              usuarioSeleccionado.dado_de_alta === true
                ? 'estado-aprobado'
                : 'estado-pendiente'
            }
          >
            {usuarioSeleccionado.dado_de_alta === true
              ? 'Aprobado'
              : 'Pendiente'}
          </span>
        </div>
        <div className="usuario-detalle-row">
          <strong>Activo:</strong>{' '}
          <span
            className={
              usuarioSeleccionado.esta_activo === true
                ? 'estado-activo'
                : 'estado-inactivo'
            }
          >
            {usuarioSeleccionado.esta_activo === true ? 'Si' : 'No'}
          </span>
        </div>
        <div className="usuario-detalle-row">
          <strong>Roles:</strong>{' '}
          <span>{usuarioSeleccionado.roles.join(', ')}</span>
        </div>
      </div>
      <button
        onClick={cerrarDetallesUsuario}
        className="usuario-detalle-close-button"
      >
        Cerrar
      </button>
    </div>
  );
};
