import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import '../Styles/Categorías/ProductDetail.css';

export const ProductDetails = () => {
  const { id } = useParams(); // Obtener el id desde la URL
  const location = useLocation(); // Obtener el estado desde la navegación
  const producto = location.state?.producto; // Intentar obtener el producto desde el estado

  const [cantidad, setCantidad] = useState(1); // Estado para la cantidad

  if (!producto) {
    return <div>Producto no encontrado</div>;
  }

  const incrementarCantidad = () => {
    setCantidad(cantidad + 1);
  };

  const decrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  const agregarAlCarrito = () => {
    // Aquí puedes implementar la lógica para agregar el producto al carrito
    console.log(`Agregando ${cantidad} de ${producto.nombre} al carrito`);
  };

  return (
    <div className="ver-producto-container">
      <div className="container-img-ver-producto">
        <img src={producto.img} alt={producto.nombre} />
      </div>

      <div className="container-precio-nombre-ver-producto">
        <h2 className="nombre-view">{producto.nombre}</h2>
        <p className="precio-view">${producto.precio}</p>

        <div className="container-cantidad">
          <button className="btn-view" onClick={decrementarCantidad}>
            -
          </button>
          <span className="cantidad-view">{cantidad}</span>
          <button className="btn-view" onClick={incrementarCantidad}>
            +
          </button>
        </div>

        {producto.stock > 0 ? (
          <button className="btn-view" onClick={agregarAlCarrito}>
            Agregar al Carrito
          </button>
        ) : (
          <button className="btn-iniciar-compra-disabled btn-view" disabled>
            Producto no disponible
          </button>
        )}
      </div>
    </div>
  );
};
