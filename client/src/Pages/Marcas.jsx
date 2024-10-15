import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Marcas/Marcas.css';

const marcasData = [
  { id: 0, nombre: 'Todas las marcas' },
  { id: 1, nombre: 'Marca 1' },
  { id: 2, nombre: 'Marca 2' },
  { id: 3, nombre: 'Marca 3' },
  { id: 4, nombre: 'Marca 4' },
  { id: 5, nombre: 'Marca 5' },
  { id: 6, nombre: 'Marca 6' },
  { id: 7, nombre: 'Marca 7' },
  { id: 8, nombre: 'Marca 8' },
  { id: 9, nombre: 'Marca 9' },
  { id: 10, nombre: 'Marca 10' },
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

export const Marcas = () => {
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(0);
  const [menuAbierto, setMenuAbierto] = useState(false);
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
    const productoExistente = nuevoCarrito.find((item) => item.id === producto.id);

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

  const filtrarProductos = useMemo(() => {
    let productosFiltrados;

    if (marcaSeleccionada === 0) {
      productosFiltrados = productosData;
    } else {
      productosFiltrados = productosData.filter((producto) => producto.marca === marcaSeleccionada);
    }

    return productosFiltrados.sort((a, b) => {
      if (a.stock === 0 && b.stock > 0) return 1;
      if (b.stock === 0 && a.stock > 0) return -1;
      return 0;
    });
  }, [marcaSeleccionada]);

  return (
    <div className="container-general-marcas">
      <div className="container-boton-filtrado">
        <button className="boton-marcas" onClick={() => setMenuAbierto(!menuAbierto)}>
          Filtrar <i className="fa-solid fa-bars"></i>
        </button>
      </div>

      <div className={`container-marcas-section-marcas ${menuAbierto ? 'menu-abierto' : ''}`}>
        <button className="cerrar-menu" onClick={() => setMenuAbierto(false)}>
          X
        </button>
        <h2 className="marcas-header">MARCAS</h2>
        <ul className="marcas-lista">
          {marcasData.map((marca) => (
            <li key={marca.id}>
              <a
                href="#"
                onClick={() => {
                  setMarcaSeleccionada(marca.id);
                  setMenuAbierto(false);
                }}
              >
                {marca.nombre}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-productos-marcas">
        {filtrarProductos.length > 0 ? (
          filtrarProductos.map((producto) => (
            <div className="card-producto" key={producto.id}>
              <div className="info-producto-card">
                <img
                  name={`img-producto-card-${producto.id}`}
                  className="img-producto-card"
                  src={producto.img}
                  alt={producto.nombre}
                />
                <p name={`tipo-precio-producto-${producto.id}`}>
                  Precio por unidad
                </p>
                <h3
                  className="nombre-producto-card"
                  name={`nombre-producto-card-${producto.id}`}
                >
                  {producto.nombre}
                </h3>
                <h3
                  className="precio-producto-card"
                  name={`precio-producto-card-${producto.id}`}
                >
                  ${producto.precio}
                </h3>
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
          ))
        ) : (
          <div className="no-productos">
            <h3>No hay productos disponibles para esta marca.</h3>
            <p>
              Lo sentimos, pero actualmente no tenemos productos de esta marca
              en nuestro catálogo. Por favor, prueba con otra marca o vuelve más
              tarde.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
