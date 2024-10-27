import React from 'react';
import { ProductosDestacadosItem } from '../home-ui/ProductosDestacadosItem';

export const ProductosNuevosIngresosGrid = ({ productos }) => {
  return (
    <div className="seccion-prod-destacados">
      <div className="productos-destacados">
        {productos.map((producto) => (
          <ProductosDestacadosItem
            key={producto.producto_id}
            producto={producto}
          />
        ))}
      </div>
    </div>
  );
};
