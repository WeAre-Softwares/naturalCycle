import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../Styles/Categorías/Categorias.css';
import '../Styles/Header/Cart.css';

const categoriasData = [
  { id: 0, nombre: 'Todos los productos' },
  { id: 1, nombre: 'Categoria 1' },
  { id: 2, nombre: 'Categoria 2' },
  { id: 3, nombre: 'Categoria 3' },
  { id: 4, nombre: 'Categoria 4' },
  { id: 5, nombre: 'Categoria 5' },
  { id: 6, nombre: 'Categoria 6' },
  { id: 7, nombre: 'Categoria 7' },
  { id: 8, nombre: 'Categoria 8' },
  { id: 9, nombre: 'Categoria 9' },
  { id: 10, nombre: 'Categoria 10' },
];

const productosData = [
  {
    id: 1,
    nombre: 'Producto A',
    precio: 5000,
    stock: 10,
    categoria: 1,
    img: '/Imagenes/producto-banner.png',
  },
  {
    id: 2,
    nombre: 'Producto B',
    precio: 6000,
    stock: 0,
    categoria: 2,
    img: '/Imagenes/producto-banner.png',
  }, // Producto sin stock
  {
    id: 3,
    nombre: 'Producto C',
    precio: 7000,
    stock: 8,
    categoria: 3,
    img: '/Imagenes/producto-banner.png',
  },
  {
    id: 4,
    nombre: 'Producto D',
    precio: 8000,
    stock: 12,
    categoria: 4,
    img: '/Imagenes/producto-banner.png',
  },
  {
    id: 5,
    nombre: 'Producto E',
    precio: 8000,
    stock: 12,
    categoria: 4,
    img: '/Imagenes/producto-banner.png',
  },
  {
    id: 6,
    nombre: 'Producto F',
    precio: 8000,
    stock: 12,
    categoria: 4,
    img: '/Imagenes/producto-banner.png',
  },
  {
    id: 7,
    nombre: 'Producto G',
    precio: 8000,
    stock: 12,
    categoria: 4,
    img: '/Imagenes/producto-banner.png',
  },
  {
    id: 8,
    nombre: 'Producto H',
    precio: 8000,
    stock: 12,
    categoria: 2,
    img: '/Imagenes/producto-banner.png',
  },
  {
    id: 9,
    nombre: 'Producto I',
    precio: 8000,
    stock: 12,
    categoria: 1,
    img: '/Imagenes/producto-banner.png',
  },
];

export const Categorias = () => {
  const [productos, setProductos] = React.useState(productosData);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [carrito, setCarrito] = useState(() => {
    // Inicializamos el carrito con lo que esté en localStorage o un array vacío
    const carritoLocal = JSON.parse(localStorage.getItem('carrito')) || [];
    return carritoLocal;
  });
  const [isCartOpen, setIsCartOpen] = useState(false); // Estado para manejar la apertura del carrito
  const navigate = useNavigate();

  // Guardar el carrito en Local Storage cada vez que se actualiza
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const modificarCantidad = (id, valor) => {
    setCarrito(
      (prevCarrito) =>
        prevCarrito
          .map((item) =>
            item.id === id
              ? { ...item, cantidad: Math.max(1, item.cantidad + valor) } // Asegurarse de que la cantidad mínima sea 1
              : item,
          )
          .filter((item) => item.cantidad > 0), // Filtrar items con cantidad 0
    );
  };

  const filtrarProductos = () => {
    const productosFiltrados =
      categoriaSeleccionada === 0 || categoriaSeleccionada === null
        ? productosData
        : productosData.filter(
            (producto) => producto.categoria === categoriaSeleccionada,
          );

    return productosFiltrados.sort((a, b) => b.stock - a.stock);
  };

  const agregarAlCarrito = (producto) => {
    const nuevoCarrito = [...carrito];
    const productoExistente = nuevoCarrito.find(
      (item) => item.id === producto.id,
    );

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      nuevoCarrito.push({ ...producto, cantidad: 1 });
    }
    setCarrito(nuevoCarrito);
  };

  const restarDelCarrito = (id) => {
    const nuevoCarrito = carrito
      .map((item) => {
        if (item.id === id && item.cantidad > 1) {
          return { ...item, cantidad: item.cantidad - 1 };
        }
        return item;
      })
      .filter((item) => item.cantidad > 0);
    setCarrito(nuevoCarrito);
  };

  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = carrito.filter((item) => item.id !== id);
    setCarrito(nuevoCarrito);
  };

  const calcularSubtotal = () => {
    return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  };

  const verDetallesProducto = (producto) => {
    navigate(`/producto/${producto.id}`, { state: { producto } });
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen); // Abre o cierra el carrito
  };

  const closeCart = () => {
    setIsCartOpen(false); // Cierra el carrito
  };

  const iniciarCompra = () => {
    if (carrito.length > 0) {
      navigate('/checkout'); // Redirige a la página de checkout
    } else {
      alert('El carrito está vacío');
    }
  };
  

  return (
    <div className="container-general-categorias">
      <div className="container-boton-filtrado">
        <button
          className="boton-categorias"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          Filtrar <i className="fa-solid fa-bars"></i>
        </button>
      </div>

      <div
        className={`container-categorias-section-categorias ${
          menuAbierto ? 'menu-abierto' : ''
        }`}
      >
        <button className="cerrar-menu" onClick={() => setMenuAbierto(false)}>
          X
        </button>
        <h2 className="categorias-header">CATEGORÍAS</h2>
        <ul className="categorias-lista">
          {categoriasData.map((categoria) => (
            <li key={categoria.id}>
              <a
                href="#"
                onClick={() => {
                  setCategoriaSeleccionada(categoria.id);
                  setMenuAbierto(false);
                }}
              >
                {categoria.nombre}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-productos-categorias">
        {filtrarProductos().map((producto) => (
          <div className="card-producto" key={producto.id}>
            <div className="info-producto-card">
              <img
                className="img-producto-card"
                src={producto.img}
                alt={producto.nombre}
              />
              <p>Precio por unidad</p>
              <h3 className="nombre-producto-card">{producto.nombre}</h3>
              <h3 className="precio-producto-card">${producto.precio}</h3>
              <p>{producto.stock > 0 ? `Stock disponible` : 'Agotado'}</p>

            </div>
            <div className="botones-card-producto">
              <button
                disabled={producto.stock === 0}
                onClick={() => agregarAlCarrito(producto)}
              >
                {producto.stock > 0 ? 'Añadir al carrito ' : 'Agotado '}
                <i className="fa-solid fa-cart-shopping"></i>
              </button>
              <button onClick={() => verDetallesProducto(producto)}>
                Ver producto <i className="fa-solid fa-eye"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botón del carrito */}
      <div className="cart-container">
        <button
          data-quantity={carrito.length}
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

        {/* Carrito */}
        {/* Carrito */}
        {isCartOpen && (
          <div
            className={`carrito-container ${isCartOpen ? 'carrito-open' : ''}`}>
              
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
                  <div key={item.id} className="producto-item">
                    <img
                      src={item.img}
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
                        <button onClick={() => modificarCantidad(item.id, -1)}>
                          -
                        </button>
                        <span>{item.cantidad}</span>
                        <button onClick={() => modificarCantidad(item.id, 1)}>
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
                      onClick={() => eliminarDelCarrito(item.id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
            {carrito.length > 0 && (
              <>
                <div className="subtotal">
                  <p>Subtotal (sin envío):</p>
                  <p>${calcularSubtotal().toLocaleString()}</p>
                </div>
                <div className="total">
                  <h3>Total:</h3>
                  <h3>${calcularSubtotal().toLocaleString()}</h3>
                </div>
                <button className='btn-iniciar-compra' onClick={iniciarCompra}>
                  Iniciar compra
                </button>
                <Link to="/Categorias" className="link-categorias">
                  <button
                    className="btn-ver-productos"
                    onClick={closeCart} // Cierra el carrito al hacer clic
                  >
                    Ver más productos
                  </button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
