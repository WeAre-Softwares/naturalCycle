import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import '../Styles/Categorías/ProductDetail.css';

export const ProductDetails = () => {
  const { id } = useParams(); // Obtener el id desde la URL
  const location = useLocation(); // Obtener el estado desde la navegación
  const producto = location.state?.producto; // Intentar obtener el producto desde el estado
  const [carrito, setCarrito] = useState(() => {
    const carritoLocal = JSON.parse(localStorage.getItem('carrito')) || [];
    return carritoLocal;
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = () => {
    const nuevoCarrito = [...carrito];
    const productoExistente = nuevoCarrito.find((item) => item.id === producto.id);

    // Agregar producto con la cantidad seleccionada
    if (productoExistente) {
      productoExistente.cantidad += cantidad; // Incrementar la cantidad del producto existente
    } else {
      nuevoCarrito.push({ ...producto, cantidad }); // Añadir nuevo producto con la cantidad
    }
    setCarrito(nuevoCarrito);
  };

  const [cantidad, setCantidad] = useState(1); // Estado para la cantidad

  // Verificar si el producto existe
  if (!producto) {
    return <div>Producto no encontrado</div>;
  }

  // Funciones para manejar la cantidad
  const incrementarCantidad = () => {
    if (producto.stock>1) {
      setCantidad(cantidad + 1); // Incrementar solo si hay stock disponible
    }
  };

  const decrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1); // Decrementar solo si la cantidad es mayor a 1
    }
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
          <button className='btn-view'
            onClick={agregarAlCarrito}
          >
            Añadir al carrito
            <i className="fa-solid fa-cart-shopping"></i>
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
