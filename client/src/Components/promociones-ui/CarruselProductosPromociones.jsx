import React from 'react';
import { ProductosPromocionesItem } from './ProductosPromocionesItem';

export const CarruselProductosPromociones = ({ productos }) => {
  return (
    <div className="seccion-prod-destacados">
      <div className="productos-destacados">
        {productos.map((producto) => (
          <ProductosPromocionesItem
            key={producto.producto_id}
            producto={producto}
          />
        ))}
      </div>
    </div>
  );
};
