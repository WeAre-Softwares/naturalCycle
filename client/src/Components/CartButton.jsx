import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/use-cart-store';
import useAuthStore from '../store/use-auth-store';
import '../Styles/Header/Cart.css';
import { crearPedido } from '../services/pedidos-service/crear-pedido';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

export const CartButton = () => {
  const { user } = useAuthStore(); // Obtén el usuario desde el estado global
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const {
    carrito,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    getTotalPrice,
    getTotalProducts,
    clearCart,
  } = useCartStore();

  const esTotalMenorAlMinimo = getTotalPrice() < 50000;

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const handleIniciarCompra = async () => {
    const usuarioId = user?.id;
    const detalles = carrito.map((item) => ({
      producto_id: item.producto_id,
      cantidad: Number(item.cantidad),
      precio_unitario: Number(item.precio),
    }));

    // Configuración de SweetAlert para la confirmación
    const customAlert = Swal.mixin({
      customClass: {
        confirmButton: 'custom-confirm-button',
        cancelButton: 'custom-cancel-button',
        popup: 'custom-alert-container',
      },
      buttonsStyling: false,
    });

    customAlert
      .fire({
        title: '¿Estás seguro?',
        text: 'Confirma tu pedido para continuar.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await crearPedido(detalles, usuarioId);

            toast.success(
              '¡Pedido confirmado! Te contactaremos pronto para coordinar el pago y finalizar tu compra. Revisa tu correo para más detalles.',
              {
                position: 'top-center',
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
              },
            );

            clearCart(); // Vaciar el carrito después de confirmar el pedido

            setTimeout(() => {
              closeCart();
              navigate('/inicio');
            }, 3000);
          } catch (error) {
            console.error('Error al crear el pedido:', error);
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          customAlert.fire({
            title: 'Cancelado',
            text: 'Tu pedido no ha sido confirmado.',
            icon: 'error',
          });
        }
      });
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
    toast.warn('Producto eliminado del carrito!', {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'dark',
    });
  };

  const handleAddToCart = (productId) => {
    incrementQuantity(productId);
  };

  return (
    <div className="cart-container">
      <ToastContainer />
      <button
        data-quantity={getTotalProducts()}
        className="btn-cart"
        onClick={toggleCart}
      >
        {getTotalProducts() > 0 ? (
          <span className="cart-quantity-badge">{getTotalProducts()}</span>
        ) : (
          ''
        )}
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
                      {item.tipo_de_precio === 'por_unidad'
                        ? item.cantidad > 1
                          ? 'unidades x'
                          : 'unidad x'
                        : item.tipo_de_precio === 'por_kilo'
                        ? item.cantidad > 1
                          ? 'kilos x'
                          : 'kilo x'
                        : item.tipo_de_precio === 'por_bulto_cerrado'
                        ? item.cantidad > 1
                          ? 'bultos cerrados'
                          : 'bulto cerrado'
                        : 'tipo desconocido'}
                    </p>
                    <p>${item.precio} </p>
                    <div className="cantidad-controles">
                      <button
                        onClick={() => decrementQuantity(item.producto_id)}
                      >
                        -
                      </button>

                      <input
                        type="number"
                        value={item.cantidad}
                        min="1"
                        max="1000"
                        onChange={(e) => {
                          const nuevaCantidad = parseInt(e.target.value, 10);
                          if (
                            !isNaN(nuevaCantidad) &&
                            nuevaCantidad >= 1 &&
                            nuevaCantidad <= 1000
                          ) {
                            updateQuantity(item.producto_id, nuevaCantidad);
                          }
                        }}
                      />

                      <button onClick={() => handleAddToCart(item.producto_id)}>
                        +
                      </button>
                    </div>
                  </div>
                  <div className="precio-producto">
                    <p>Subtotal: ${item.precio * item.cantidad}</p>
                  </div>
                  <button
                    className="eliminar-producto"
                    onClick={() => handleRemoveFromCart(item.producto_id)}
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
                <h3>${getTotalPrice()}</h3>
              </div>

              {getTotalPrice() < 50000 && (
                <p className="mensaje-minimo-compra">
                  El monto mínimo para realizar un pedido es de $50.000
                </p>
              )}

              <button
                className="btn-iniciar-compra"
                onClick={handleIniciarCompra}
                disabled={esTotalMenorAlMinimo}
              >
                Realizar pedido
              </button>
              <button
                className="btn-ver-productos"
                onClick={() => {
                  closeCart();
                  navigate('/categorias');
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
