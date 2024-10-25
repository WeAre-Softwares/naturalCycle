import React from 'react';

export const ProductosDestacadosItem = ({ producto }) => {
  return (
    <div className="card-producto">
      <div className="info-producto-card">
        <img
          name={`img-producto-card-${producto.producto_id}`}
          className="img-producto-card"
          src={producto.imagenes[0]?.url}
          alt={producto.nombre}
        />

        <h2 className="nombre-producto-card">{producto.nombre}</h2>
        <span className="nombre-producto-card">
          {producto.tipo_de_precio === 'por_kilo' ? 'Por Kilo' : 'Por Unidad'}
        </span>
        <br />
        <h2 className="precio-producto-card">${producto.precio}</h2>
        <span>
          {producto.disponible === true ? 'Stock disponible' : 'Agotado'}
        </span>
      </div>
      <div className="botones-card-producto">
        //TODO: Agregar funcionalidad
        <button
          disabled={!producto.disponible}
          //   onClick={() => agregarAlCarrito(producto)}
        >
          {producto.disponible === true ? 'Añadir al carrito' : 'Agotado'}
          <i className="fa-solid fa-cart-shopping"></i>
        </button>
        //TODO: Agregar funcionalidad
        {/* <button onClick={() => verDetallesProducto(producto)}> */}
        <button>
          Ver producto <i className="fa-solid fa-eye"></i>
        </button>
      </div>
    </div>
  );
};
