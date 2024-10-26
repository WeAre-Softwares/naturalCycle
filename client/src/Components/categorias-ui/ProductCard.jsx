import React from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/use-cart-store';

export const ProductCard = ({ producto }) => {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();

  const verDetallesProducto = () => {
    navigate(`/producto/${producto.producto_id}`);
  };

  const agregarAlCarrito = () => {
    addToCart(producto);
  };

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
        <button disabled={!producto.disponible} onClick={agregarAlCarrito}>
          {producto.disponible === true ? 'Añadir al carrito' : 'Agotado'}
          <i className="fa-solid fa-cart-shopping"></i>
        </button>
        <button onClick={() => verDetallesProducto(producto)}>
          Ver producto <i className="fa-solid fa-eye"></i>
        </button>
      </div>
    </div>
  );
};
