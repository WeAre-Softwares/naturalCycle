import React from 'react';
import { ProductosDestacadosItem } from './ProductosDestacadosItem';

export const ProductosDestacadosGrid = ({ productos }) => {
  return (
    <div className="seccion-prod-destacados">
      <div className="container-h2-prod-destacados">
        <h2 className="titulo-pre-banner">Productos destacados</h2>
      </div>
      <div className="productos-destacados">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <ProductosDestacadosItem
              key={producto.producto_id}
              producto={producto}
            />
          ))
        ) : (
          <p>No hay productos destacados.</p>
        )}
      </div>
    </div>
  );
};
