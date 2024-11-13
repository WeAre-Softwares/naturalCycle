import React from 'react';

export const NoHayResultados = ({ entidad: nombreEntidad }) => {
  return (
    <div className="no-productos-marc-cat">
      <h3>No se han encontrado {nombreEntidad}.</h3>
      <p>
        Lo sentimos, pero actualmente no tenemos {nombreEntidad} que coincidan
        con la selección realizada. Intente nuevamente o vuelva más tarde.
      </p>
    </div>
  );
};
