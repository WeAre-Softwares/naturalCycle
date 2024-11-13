import React from 'react';
import { UsuarioCard } from './UsuarioCard';
import { NoHayResultados } from '../NoHayResultados';

export const UsuariosGrid = ({
  usuarios,
  mostrarDetallesUsuario,
  darDeAltaUsuario,
  darDeBajaUsuario,
  darRangoEmpleadoUsuario,
}) => {
  if (usuarios.length === 0) {
    return <NoHayResultados entidad={'usuarios'} />;
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
