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
          <div className="marcas-dest-alerta"> <div className="no-productos-marc-cat">
      <h3>No se ha encontrado ninguna marca destacada.</h3>
      <p>
        Lo sentimos, pero actualmente no tenemos una marca en esta sección.
      </p>
    </div></div>
        )}
      </div>
    </div>
  );
};
