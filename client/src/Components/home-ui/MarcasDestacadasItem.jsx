import React from 'react';
import '../../Styles/Inicio/Inicio.css';

export const MarcasDestacadasItem = ({ marca: { imagen_url, nombre } }) => {
  return (
    <div className="card-marca-destacadas">
      <img
        src={imagen_url}
        alt={`Marca destacada ${nombre}`}
        className="img-marca"
      />
    </div>
  );
};
