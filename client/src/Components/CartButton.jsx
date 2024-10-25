import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/use-cart-store';
import '../Styles/Header/Cart.css';

export const CartButton = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const {
    carrito,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    getTotalPrice,
    getTotalProducts,
  } = useCartStore();

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  return (
    <div className="cart-container">
      <button
        data-quantity={getTotalProducts()}
        className="btn-cart"
        onClick={toggleCart}
      >
        <svg
          className="icon-cart"
          viewBox="0 0 24.38 30.52"
          height="30.52"
          width="24.38"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            transform="translate(-3.62 -0.85)"
            d="M28,27.3,26.24,7.51a.75.75,0,0,0-.76-.69h-3.7a6,6,0,0,0-12,0H6.13a.76.76,0,0,0-.76.69L3.62,27.3v.07a4.29,4.29,0,0,0,4.52,4H23.48a4.29,4.29,0,0,0,4.52-4ZM15.81,2.37a4.47,4.47,0,0,1,4.46,4.45H11.35a4.47,4.47,0,0,1,4.46-4.45Zm7.67,27.48H8.13a2.79,2.79,0,0,1-3-2.45L6.83,8.34h3V11a.76.76,0,0,0,1.52,0V8.34h8.92V11a.76.76,0,0,0,1.52,0V8.34h3L26.48,27.4a2.79,2.79,0,0,1-3,2.44Zm0,0"
          ></path>
        </svg>
      </button>

      {isCartOpen && (
        <div
          className={`carrito-container ${isCartOpen ? 'carrito-open' : ''}`}
        >
          <div className="header-carrito">
            <h2>Carrito de compras</h2>
            <button className="cerrar-carrito" onClick={closeCart}>
              X
            </button>
          </div>
          <div className="productos-lista">
            {carrito.length === 0 ? (
              <div className="mensaje-vacio">
                <p>El carrito de compras está vacío.</p>
                <p>¡Añade productos a tu carrito para comenzar a comprar!</p>
              </div>
            ) : (
              carrito.map((item) => (
                <div key={item.producto_id} className="producto-item">
                  <img
                    src={item.imagenes[0]?.url}
                    alt={item.nombre}
                    className="img-producto-carrito"
                  />
                  <div className="info-producto">
                    <p>{item.nombre}</p>
                    <p>
                      {item.cantidad}{' '}
                      {item.unidadMedida === 'kg' ? 'kg' : 'unidades'}
                    </p>
                    <div className="cantidad-controles">
                      <button
                        onClick={() => decrementQuantity(item.producto_id)}
                      >
                        -
                      </button>
                      <span>{item.cantidad}</span>
                      <button
                        onClick={() => incrementQuantity(item.producto_id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="precio-producto">
                    <p>
                      ${(item.precio * item.cantidad).toLocaleString()}{' '}
                      {item.unidadMedida === 'kg' ? '/kg' : ''}
                    </p>
                  </div>
                  <button
                    className="eliminar-producto"
                    onClick={() => removeFromCart(item.producto_id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))
            )}
          </div>
          {carrito.length > 0 && (
            <>
              <div className="total">
                <h3>Total:</h3>
                <h3>${getTotalPrice().toLocaleString()}</h3>
              </div>
              {/* TODO: IMPLEMENTAR LÓGICA */}
              <button className="btn-iniciar-compra">Iniciar Compra</button>
              <button
                className="btn-ver-productos"
                onClick={() => {
                  closeCart();
                  navigate('/Categorias');
                }}
              >
                Ver más productos
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
