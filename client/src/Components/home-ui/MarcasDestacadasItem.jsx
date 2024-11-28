import React from 'react';
import { Link } from 'react-router-dom'; 
import '../../Styles/Inicio/Inicio.css';

export const MarcasDestacadasItem = ({ marca, setMarcaSeleccionada }) => {
  const { imagen_url, nombre } = marca; 

  return (
    <Link
      to={`/marcas/${nombre}`} 
      onClick={() => {
        setMarcaSeleccionada(nombre); 
      }}
    >
      <div className="card-marca-destacadas">
        <img
          src={imagen_url}
          alt={`Marca destacada ${nombre}`}
          className="img-marca"
        />
      </div>
    </Link>
  );
};
