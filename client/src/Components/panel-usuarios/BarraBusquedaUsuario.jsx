import React from 'react';

export const BarraBusquedaUsuario = ({ searchTerm, setSearchTerm }) => {
  return (
    <input
      type="text"
      placeholder="Buscar usuario..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="area-usuarios-input"
    />
  );
};
