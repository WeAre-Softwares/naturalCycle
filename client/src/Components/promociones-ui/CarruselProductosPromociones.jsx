import React from 'react';
import { ProductosPromocionesItem } from './ProductosPromocionesItem';

export const CarruselProductosPromociones = ({ productos }) => {
  return (
    <div className="carrusel-promociones">
      <div className="productos-carrusel">
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
