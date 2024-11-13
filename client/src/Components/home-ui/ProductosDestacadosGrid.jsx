import React from 'react';
import { ProductosDestacadosItem } from './ProductosDestacadosItem';
import { NoHayProductos } from '../categorias-ui';

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
          <NoHayProductos></NoHayProductos>
        )}
      </div>
    </div>
  );
};
