import React from 'react';

export const Buscador = ({ setBusqueda }) => {
  return (
    <div className="group">
      <i className="fas fa-search icon"></i>
      <input
        type="text"
        className="input-busca-productos"
        placeholder="Buscar"
        onChange={(e) => setBusqueda(e.target.value)}
      />
    </div>
  );
};
