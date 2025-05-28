import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCartStore from '../../store/use-cart-store';
import useAuthStore from '../../store/use-auth-store';
import { allowedRoles } from '../../constants/allowed-roles';
import { NoStockLogo } from '../NoStockLogo';
import { SiStockLogo } from '../SiStockLogo';
import { strToUppercase } from '../../helpers/strToUpercase';
import { quantityProductSchema } from '/src/schemas/quantity-Product-schema.js';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
export const ProductCard = ({ producto }) => {

  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { isAuthenticated, getRoles } = useAuthStore();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(quantityProductSchema),
    defaultValues: {
      quantityProduct: 0,
    },
  });
  const { carrito } = useCartStore();
  const quantityProduct = watch('quantityProduct');
  const currentProdQuantity = carrito.find(p => p.producto_id === producto.producto_id)?.cantidad || 0;
  const newQuantity = Number(watch('quantityProduct'));
  const sum = currentProdQuantity + newQuantity;

  const isUserLoggedIn = isAuthenticated();
  const userRoles = getRoles();

  const hasAccessRole = allowedRoles.some((role) => userRoles.includes(role));


  const verDetallesProducto = () => {
    navigate(`/producto/${producto.producto_id}`);
  };

  const agregarAlCarrito = () => {

    if (!isUserLoggedIn) {
      toast.error('Debes registrarte para agregar productos al carrito.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
      setValue('quantityProduct', 0);
    } else if (!quantityProduct || quantityProduct < 1) {
      toast.error('La cantidad debe ser mayor a 0.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
      setValue('quantityProduct', 0);
    } else if (sum > 1000) {
      toast.warning('La cantidad máxima permitida es 1000 unidades.');
      addToCart({ ...producto, cantidad: 1000 - currentProdQuantity });
      setValue('quantityProduct', 0);
    } else {
      addToCart({ ...producto, cantidad: Number(watch('quantityProduct')) });
      setValue('quantityProduct', 0);
    }

  };

  const incrementarCantidad = () => {
    const current = Number(watch('quantityProduct') || 0);
    if (current < 999) setValue('quantityProduct', current + 1);
  };

  const decrementarCantidad = () => {
    const current = Number(watch('quantityProduct') || 0);
    if (current > 1) setValue('quantityProduct', current - 1);
  };

  return (
    <>

      <div className="card-producto">
        {producto.disponible === true ? <SiStockLogo /> : <NoStockLogo />}
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

          {/* Mostrar el precio solo si el usuario tiene un rol permitido */}
          {isUserLoggedIn && hasAccessRole && (
            <>
              <span className="nombre-producto-card">
                {producto.tipo_de_precio.replace(/_/g, ' ')}
              </span>
              <br />
              {/* Mostrar solo si tiene precio de oferta */}
              <div
                className={`${producto.precio_antes_oferta != null &&
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
        </div>

        {/* Controles de cantidad */}
        <div className="control-cantidad">
          <button onClick={decrementarCantidad} disabled={watch('quantityProduct') === 1}>
            -
          </button>
          <input
            type="text"
            {...register('quantityProduct')}
            onChange={(e) => {
              const raw = e.target.value;
              if (/^\d{0,3}$/.test(raw)) {
                setValue('quantityProduct', raw === '' ? '' : Number(raw));
              }
            }}
            value={Number(watch('quantityProduct'))}
            className={`input_ForProducCard ${errors.quantityProduct ? 'error' : ''}`}
          />

          {errors.quantityProduct && <p className="error-message">{errors.quantityProduct.message}</p>}
          <button
            onClick={incrementarCantidad}
            disabled={!producto.disponible || (!isUserLoggedIn && !hasAccessRole)}
          >
            +
          </button>
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
    </>

  );
};
