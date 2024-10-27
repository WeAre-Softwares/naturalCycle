import React from 'react';
import { ProductosDestacadosItem } from '../home-ui';

export const CarruselProductosPromociones = ({ productos }) => {
  return (
    <div className="carrusel-promociones">
      <div className="productos-carrusel">
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
