import React from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/use-cart-store';
import useAuthStore from '../../store/use-auth-store';
import { allowedRoles } from '../../constants/allowed-roles';

export const ProductCard = ({ producto }) => {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { isAuthenticated, getRoles } = useAuthStore();

  // Definir roles permitidos para ver el precio y añadir al carrito
  const isUserLoggedIn = isAuthenticated();
  const userRoles = getRoles();

  // Verificar si el usuario tiene al menos uno de los roles permitidos
  const hasAccessRole = allowedRoles.some((role) => userRoles.includes(role));

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

        {/* Mostrar el precio solo si el usuario tiene un rol permitido */}
        {isUserLoggedIn && hasAccessRole && (
          <>
            <span className="nombre-producto-card">
              {producto.tipo_de_precio.replace(/_/g, ' ')}
            </span>
            <br />
            {/* Mostrar solo si tiene precio de oferta */}
            <div
              className={`${
                producto.precio_antes_oferta != null &&
                !isNaN(Number(producto.precio_antes_oferta))
                  ? 'precios-promo'
                  : ''
              }`}
            >
              {producto.precio_antes_oferta != null &&
                !isNaN(Number(producto.precio_antes_oferta)) && (
                  <h2 className="precio-producto-card precio-viejo-promo">
                    ${Number(producto.precio_antes_oferta).toLocaleString()}
                  </h2>
                )}
              <h2 className="precio-producto-card">
                ${Number(producto.precio).toLocaleString()}
              </h2>
            </div>
          </>
        )}

        <span>
          {producto.disponible === true ? 'Stock disponible' : 'Agotado'}
        </span>
      </div>
      <div className="botones-card-producto">
        {/* Activar el botón "Añadir al carrito" solo si el usuario tiene un rol permitido */}
        <button
          disabled={!producto.disponible || (!isUserLoggedIn && !hasAccessRole)}
          onClick={agregarAlCarrito}
        >
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
