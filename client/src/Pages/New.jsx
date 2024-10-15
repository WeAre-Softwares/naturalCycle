import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Categorías/Categorias.css';
import '../Styles/Header/Cart.css';
import '../Styles/New/New.css';

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
    },
    {
      id: 3,
      nombre: 'Producto C',
      precio: 7000,
      stock: 5,
      categoria: 1,
      img: '/Imagenes/producto-banner.png',
    },
    {
      id: 4,
      nombre: 'Producto D',
      precio: 8000,
      stock: 15,
      categoria: 3,
      img: '/Imagenes/producto-banner.png',
    },
    {
      id: 5,
      nombre: 'Producto E',
      precio: 4500,
      stock: 20,
      categoria: 2,
      img: '/Imagenes/producto-banner.png',
    },
    {
      id: 6,
      nombre: 'Producto F',
      precio: 3000,
      stock: 0,
      categoria: 1,
      img: '/Imagenes/producto-banner.png',
    },
    {
      id: 7,
      nombre: 'Producto G',
      precio: 5500,
      stock: 8,
      categoria: 3,
      img: '/Imagenes/producto-banner.png',
    },
    {
      id: 8,
      nombre: 'Producto H',
      precio: 9200,
      stock: 2,
      categoria: 2,
      img: '/Imagenes/producto-banner.png',
    },
    {
      id: 9,
      nombre: 'Producto I',
      precio: 3800,
      stock: 12,
      categoria: 1,
      img: '/Imagenes/producto-banner.png',
    },
    // Otros productos
  ];
  

export const New = () => {
  const [productos, setProductos] = useState(productosData);
  const [carrito, setCarrito] = useState(() => {
    const carritoLocal = JSON.parse(localStorage.getItem('carrito')) || [];
    return carritoLocal;
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    const nuevoCarrito = [...carrito];
    const productoExistente = nuevoCarrito.find(
      (item) => item.id === producto.id
    );

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      nuevoCarrito.push({ ...producto, cantidad: 1 });
    }
    setCarrito(nuevoCarrito);
  };

  const verDetallesProducto = (producto) => {
    navigate(`/producto/${producto.id}`, { state: { producto } });
  };

  return (
    <div className="div-general-nuevos-ingresos">
      <div className="intro-nuevos-productos">
        <h2>Nuevos Productos</h2>
        <p>Descubre nuestros últimos productos agregados. ¡No te los pierdas!</p>
      </div>

      <div className="container-productos-categorias">
        {productos.map((producto) => (
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
                {producto.stock > 0 ? 'Añadir al carrito' : 'Agotado'}
                <i className="fa-solid fa-cart-shopping"></i>
              </button>
              <button onClick={() => verDetallesProducto(producto)}>
                Ver producto <i className="fa-solid fa-eye"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

