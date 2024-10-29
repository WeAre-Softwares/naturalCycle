import React from 'react';
import { MarcasDestacadasItem } from './MarcasDestacadasItem';
import '../../Styles/Inicio/Inicio.css';

export const MarcasDestacadasGrid = ({ marcas }) => {
  
  return (
    <div className="seccion-marcas-destacadas">
      <div className="h2-marcas-destacadas">
        <h2 className="titulo-pre-banner">Marcas destacadas</h2>
      </div>
      <div className="marcas-destacadas">
        {Array.isArray(marcas) && marcas.length > 0 ? (
          marcas.map((marca) => (
            <MarcasDestacadasItem key={marca.marca_id} marca={marca} />
          ))
        ) : (
          <p className='no-marcas-destacadas'>No hay marcas destacadas.</p>
        )}
      </div>
    </div>
  );
};
