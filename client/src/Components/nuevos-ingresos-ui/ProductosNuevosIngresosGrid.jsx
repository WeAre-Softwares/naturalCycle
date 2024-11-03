import React from 'react';
import { ProductosNuevosIngresosItem } from './ProductosNuevosIngresosItem';

export const ProductosNuevosIngresosGrid = ({ productos }) => {
  return (
    <div className="seccion-prod-destacados">
      <div className="productos-destacados">
        {productos.map((producto) => (
          <ProductosNuevosIngresosItem
            key={producto.producto_id}
            producto={producto}
          />
        ))}
      </div>
    </div>
  );
};
