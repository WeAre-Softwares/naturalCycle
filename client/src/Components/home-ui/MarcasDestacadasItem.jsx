import React from 'react';
import '../../Styles/Inicio/Inicio.css';

export const MarcasDestacadasItem = ({ marca }) => {
  return (
    <div className="card-marca-destacadas">
      <img
        src={marca.imagen}
        alt={`Marca destacada ${marca.nombre}`}
        className="img-marca"
      />
    </div>
  );
};
