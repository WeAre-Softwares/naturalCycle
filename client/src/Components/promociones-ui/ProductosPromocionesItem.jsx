import React, { useState } from 'react'; // Asegúrate de importar useState
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCartStore from '../../store/use-cart-store';
import useAuthStore from '../../store/use-auth-store';
import { allowedRoles } from '../../constants/allowed-roles';
import { DiscountLogo } from '../DiscountLogo';
import { strToUppercase } from '../../helpers/strToUpercase';

export const ProductosPromocionesItem = ({ producto }) => {
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { isAuthenticated, getRoles } = useAuthStore();

  // Verificar si el usuario está autenticado y tiene rol de usuario
  const isUserLoggedIn = isAuthenticated();
  const userRoles = getRoles();
  // Verificar si el usuario tiene al menos uno de los roles permitidos
  const hasAccessRole = allowedRoles.some((role) => userRoles.includes(role));

  // Estado para manejar la cantidad seleccionada
  const [quantity, setQuantity] = useState(1);

  const verDetallesProducto = () => {
    navigate(`/producto/${producto.producto_id}`);
  };

  const agregarAlCarrito = () => {
    if (!isUserLoggedIn) {
      // Mostrar una alerta si el usuario no está autenticado
      toast.error('Debes registrarte para agregar productos al carrito.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    } else {
      // Si está autenticado, agregar al carrito
      addToCart({ ...producto, cantidad: quantity });
    }
  };

  // Incrementar la cantidad seleccionada
  const incrementarCantidad = () => {
    setQuantity((prev) => prev + 1);
  };

  // Decrementar la cantidad seleccionada
  const decrementarCantidad = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <div className="card-producto">
      <DiscountLogo></DiscountLogo>
      <div className="info-producto-card">
        <img
          name={`img-producto-card-${producto.producto_id}`}
          className="img-producto-card"
          src={producto.imagenes[0]?.url}
          alt={producto.nombre}
        />

        <h2 className="nombre-producto-card">
          {strToUppercase(producto.nombre)}
        </h2>
        {/* Mostrar el precio solo si el usuario está logueado y tiene rol "usuario" */}
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
                    ${Number(producto.precio_antes_oferta)}
                  </h2>
                )}
              <h2 className="precio-producto-card">
                ${Number(producto.precio)}
              </h2>
            </div>
          </>
        )}

        {/* Controles de cantidad */}
        <div className="control-cantidad">
          <button onClick={decrementarCantidad} disabled={quantity === 1}>
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={incrementarCantidad}
            disabled={
              !producto.disponible || (!isUserLoggedIn && !hasAccessRole)
            }
          >
            +
          </button>
        </div>
      </div>
      <div className="botones-card-producto">
        {/* Botón "Añadir al carrito" */}
        {producto.disponible === true ? (
          <button onClick={agregarAlCarrito}>
            Añadir al carrito <i className="fa-solid fa-cart-shopping"></i>
          </button>
        ) : (
          <button className="btn-iniciar-compra-disabled" disabled>
            Agotado
            <i className="fa-solid fa-cart-shopping"></i>
          </button>
        )}

        <button onClick={() => verDetallesProducto(producto)}>
          Ver producto <i className="fa-solid fa-eye"></i>
        </button>
      </div>
    </div>
  );
};
