import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../Styles/Categorías/ProductDetail.css';
import { useGetProductById } from '../hooks/hooks-product/useGetProductById';
import useCartStore from '../store/use-cart-store';
import useAuthStore from '../store/use-auth-store';
import { allowedRoles } from '../constants/allowed-roles';
import { useNavigate } from 'react-router-dom';

export const ProductDetails = () => {
  const { id } = useParams();
  const { product, error, loading } = useGetProductById(id);
  const { addToCart } = useCartStore();
  const { isAuthenticated, getRoles } = useAuthStore();
  const navigate = useNavigate();

  // Roles y autenticación
  const isUserLoggedIn = isAuthenticated();
  const userRoles = getRoles();
  const hasAccessRole = allowedRoles.some((role) => userRoles.includes(role));

  // Estado para manejar la cantidad seleccionada
  const [quantity, setQuantity] = useState(1);

  // Incrementar la cantidad seleccionada
  const incrementarCantidad = () => {
    setQuantity((prev) => prev + 1);
  };

  // Decrementar la cantidad seleccionada
  const decrementarCantidad = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  // Agregar la cantidad seleccionada al carrito
  const agregarAlCarrito = () => {
    if (product) {
      addToCart({ ...product, cantidad: quantity });
    }
  };

  return (
    <div className="ver-producto-container">
      <div className="button-volver-container">
        <button
          className="button-volver-panel-producto"
          onClick={() => navigate(-1)}
        >
          <i className="fas fa-arrow-left"></i>&nbsp;&nbsp;Volver
        </button>
      </div>

      {loading && (
        <section className="dots-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </section>
      )}
      {error && <p>Hubo un error al cargar el producto.</p>}
      {!loading && !error && !product && <p>Producto no encontrado</p>}

      {!loading && !error && product && (
        <>
          <div className="container-img-ver-producto">
            <img src={product.imagenes[0]?.url} alt={product.nombre} />
          </div>

          <div className="container-precio-nombre-ver-producto">
            <h2 className="nombre-view">{product.nombre}</h2>
            <p className="text-style description-view-prod">
              <strong>Descripción:</strong> {product.descripcion}
            </p>

            <p className="text-style" style={{ marginBottom: '15px' }}>
              <strong>Marca:</strong> {product.marca.nombre}
            </p>

            <div className="text-style" style={{ marginBottom: '15px' }}>
              <strong>Categorías:</strong>
              <ul className="text-list">
                {product.categorias.map((categoria, index) => (
                  <li key={index} className="text-list-item">
                    {categoria.nombre}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-style">
              <strong>Etiquetas:</strong>
              <ul className="text-list">
                {product.etiquetas.map((etiqueta, index) => (
                  <li key={index} className="text-list-item">
                    {etiqueta.nombre}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mostrar el precio solo si el usuario tiene un rol permitido */}
            {isUserLoggedIn && hasAccessRole && (
              <div className="price-container">
                {product.precio_antes_oferta != null &&
                  !isNaN(Number(product.precio_antes_oferta)) && (
                    <h3 className="precio-producto-card precio-viejo-promo">
                      ${Number(product.precio_antes_oferta)}
                    </h3>
                  )}
                <p className="precio-view">${Number(product.precio)}</p>
                <span style={{ marginLeft: '8px' }}>
                  &#8722; {product.tipo_de_precio.replace(/_/g, ' ')}
                </span>
              </div>
            )}

            <div className="container-cantidad">
              <button
                onClick={decrementarCantidad}
                disabled={!isUserLoggedIn && !hasAccessRole}
                className="btn-view"
              >
                -
              </button>
              <span className="cantidad-view">{quantity}</span>
              <button
                onClick={incrementarCantidad}
                disabled={!isUserLoggedIn && !hasAccessRole}
                className="btn-view"
              >
                +
              </button>
            </div>

            {/* Botón "Añadir al carrito" */}
            {product.disponible ? (
              <button
                onClick={agregarAlCarrito}
                className="btn-view"
                disabled={!isUserLoggedIn && !hasAccessRole}
              >
                Añadir al carrito <i className="fa-solid fa-cart-shopping"></i>
              </button>
            ) : (
              <button className="btn-iniciar-compra-disabled btn-view" disabled>
                Producto no disponible
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
