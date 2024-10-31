import React from 'react';

export const UsuarioCard = ({
  usuario,
  mostrarDetallesUsuario,
  darDeAltaUsuario,
  darDeBajaUsuario,
}) => {
  const handleDarDeAlta = () => {
    darDeAltaUsuario(usuario.usuario_id);
  };

  const handleDarDeBaja = () => {
    darDeBajaUsuario(usuario.usuario_id);
  };

  return (
    <div key={usuario.usuario_id} className="area-usuarios-item">
      <p
        className="area-usuarios-name"
        onClick={() => mostrarDetallesUsuario(usuario)} // Mostrar detalles al hacer clic
      >
        {usuario.nombre} {usuario.apellido}
      </p>
      {usuario.esta_activo === true ? (
        <button
          onClick={handleDarDeBaja}
          className="area-usuarios-approve-button"
        >
          Dar de Baja
        </button>
      ) : (
        <button
          onClick={handleDarDeAlta}
          className="area-usuarios-return-button"
        >
          Dar de Alta
        </button>
      )}
    </div>
  );
};
