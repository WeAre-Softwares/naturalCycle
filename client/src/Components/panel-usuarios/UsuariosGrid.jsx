import React from 'react';
import { UsuarioCard } from './UsuarioCard';

export const UsuariosGrid = ({
  usuarios,
  mostrarDetallesUsuario,
  darDeAltaUsuario,
  darDeBajaUsuario,
  darRangoEmpleadoUsuario,
}) => {
  if (usuarios.length === 0) {
    return <p>No se encontraron usuarios para los criterios seleccionados.</p>;
  }

  return (
    <div className="area-usuarios-list">
      {usuarios.map((usuario, index) => (
        <UsuarioCard
          key={`${usuario.usuario_id}-${index}`}
          usuario={usuario}
          mostrarDetallesUsuario={mostrarDetallesUsuario}
          darDeAltaUsuario={darDeAltaUsuario}
          darDeBajaUsuario={darDeBajaUsuario}
          darRangoEmpleadoUsuario={darRangoEmpleadoUsuario}
        />
      ))}
    </div>
  );
};
