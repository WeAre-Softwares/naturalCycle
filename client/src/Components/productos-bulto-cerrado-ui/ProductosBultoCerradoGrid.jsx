import React from 'react';
import { ProductoBultoCerradoItem } from './ProductoBultoCerradoItem';

export const ProductosBultoCerradoGrid = ({ productos }) => {
  return (
    <div className="seccion-prod-destacados">
      <div className="productos-destacados">
        {productos.map((producto) => (
          <ProductoBultoCerradoItem
            key={producto.producto_id}
            producto={producto}
          />
        ))}
      </div>
    </div>
  );
};
