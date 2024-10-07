import React, { useState } from 'react';
import './Marcas.css';

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
  { id: 1, nombre: 'Producto A', precio: 1000, stock: 10, marca: 1, img: './Imagenes/producto-banner.png' },
  { id: 2, nombre: 'Producto B', precio: 2000, stock: 0, marca: 2, img: './Imagenes/producto-banner.png' }, // Producto sin stock
  { id: 3, nombre: 'Producto C', precio: 3000, stock: 8, marca: 3, img: './Imagenes/producto-banner.png' },
  { id: 4, nombre: 'Producto D', precio: 4000, stock: 12, marca: 4, img: './Imagenes/producto-banner.png' },
  { id: 5, nombre: 'Producto E', precio: 5000, stock: 10, marca: 1, img: './Imagenes/producto-banner.png' },
  { id: 6, nombre: 'Producto F', precio: 6000, stock: 0, marca: 1, img: './Imagenes/producto-banner.png' }, // Producto sin stock
  { id: 7, nombre: 'Producto G', precio: 7000, stock: 8, marca: 2, img: './Imagenes/producto-banner.png' },
  { id: 8, nombre: 'Producto H', precio: 8000, stock: 12, marca: 4, img: './Imagenes/producto-banner.png' },
];

const Marcas = () => {
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false); // Estado para controlar si el menú está abierto

  const filtrarProductos = () => {
    let productosFiltrados;

    if (marcaSeleccionada === 0 || marcaSeleccionada === null) {
      productosFiltrados = productosData;
    } else {
      productosFiltrados = productosData.filter(producto => producto.marca === marcaSeleccionada);
    }

    return productosFiltrados.sort((a, b) => {
      if (a.stock === 0 && b.stock > 0) return 1;
      if (b.stock === 0 && a.stock > 0) return -1;
      return 0;
    });
  };

  const productosFiltrados = filtrarProductos();

  return (
    <div className="container-general-marcas">
      <div className="container-boton-filtrado">
        <button className="boton-marcas" onClick={() => setMenuAbierto(!menuAbierto)}>
          Filtrar <i className='fa-solid fa-bars'></i>
        </button>
      </div>

      <div className={`container-marcas-section-marcas ${menuAbierto ? 'menu-abierto' : ''}`}>
        <button className="cerrar-menu" onClick={() => setMenuAbierto(false)}>X</button>
        <h2 className="marcas-header">MARCAS</h2>
        <ul className="marcas-lista">
          {marcasData.map(marca => (
            <li key={marca.id}>
              <a
                href="#"
                onClick={() => {
                  setMarcaSeleccionada(marca.id);
                  setMenuAbierto(false); // Cierra el menú cuando se selecciona una marca
                }}
              >
                {marca.nombre}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-productos-marcas">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map(producto => (
            <div className="card-producto" key={producto.id}>
              <div className="info-producto-card">
                <img
                  name={`img-producto-card-${producto.id}`}
                  className="img-producto-card"
                  src={producto.img}
                  alt={producto.nombre}
                />
                <p name={`tipo-precio-producto-${producto.id}`}>Precio por unidad</p>
                <h3 className="nombre-producto-card" name={`nombre-producto-card-${producto.id}`}>
                  {producto.nombre}
                </h3>
                <h3 className="precio-producto-card" name={`precio-producto-card-${producto.id}`}>
                  ${producto.precio}
                </h3>
                <p name={`stock-producto-card-${producto.id}`}>
                  Stock disponible: {producto.stock > 0 ? 'Disponible' : 'No disponible'}
                </p>
              </div>
              <div className="botones-card-producto">
                <button disabled={producto.stock === 0}>
                  {producto.stock > 0 ? 'Añadir al carrito ' : 'Agotado '}
                  <i className="fa-solid fa-cart-shopping"></i>
                </button>
                <button>
                  Ver producto  <i className="fa-solid fa-eye"></i>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-productos">
            <h3>No hay productos disponibles para esta marca.</h3>
            <p>Lo sentimos, pero actualmente no tenemos productos de esta marca en nuestro catálogo. Por favor, prueba con otra marca o vuelve más tarde.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marcas;
