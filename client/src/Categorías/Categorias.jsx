import React, { useState } from 'react';
import './Categorias.css';

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
  { id: 1, nombre: 'Producto A', precio: 5000, stock: 10, categoria: 1, img: './Imagenes/producto-banner.png' },
  { id: 2, nombre: 'Producto B', precio: 6000, stock: 0, categoria: 2, img: './Imagenes/producto-banner.png' }, // Producto sin stock
  { id: 3, nombre: 'Producto C', precio: 7000, stock: 8, categoria: 3, img: './Imagenes/producto-banner.png' },
  { id: 4, nombre: 'Producto D', precio: 8000, stock: 12, categoria: 4, img: './Imagenes/producto-banner.png' },
  { id: 5, nombre: 'Producto E', precio: 8000, stock: 12, categoria: 4, img: './Imagenes/producto-banner.png' },
  { id: 6, nombre: 'Producto F', precio: 8000, stock: 12, categoria: 4, img: './Imagenes/producto-banner.png' },
  { id: 7, nombre: 'Producto G', precio: 8000, stock: 12, categoria: 4, img: './Imagenes/producto-banner.png' },
  { id: 8, nombre: 'Producto H', precio: 8000, stock: 12, categoria: 2, img: './Imagenes/producto-banner.png' },
  { id: 9, nombre: 'Producto I', precio: 8000, stock: 12, categoria: 1, img: './Imagenes/producto-banner.png' },
  { id: 10, nombre: 'Producto J', precio: 9000, stock: 0, categoria: 5, img: './Imagenes/producto-banner.png' }, // Producto sin stock
];

const Categorias = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false); // Estado para controlar si el menú está abierto

  const filtrarProductos = () => {
    let productosFiltrados;

    if (categoriaSeleccionada === 0) {
      productosFiltrados = productosData;
    } else if (categoriaSeleccionada === null) {
      productosFiltrados = productosData;
    } else {
      productosFiltrados = productosData.filter(producto => producto.categoria === categoriaSeleccionada);
    }

    return productosFiltrados.sort((a, b) => {
      if (a.stock === 0 && b.stock > 0) return 1;
      if (b.stock === 0 && a.stock > 0) return -1;
      return 0;
    });
  };

  return (
    <div className="container-general-categorias">
      <div className="container-boton-filtrado">
      <button className="boton-categorias" onClick={() => setMenuAbierto(!menuAbierto)}>
        Filtrar <i className='fa-solid fa-bars'></i>
      </button>
      </div>

      <div className={`container-categorias-section-categorias ${menuAbierto ? 'menu-abierto' : ''}`}>
        <button className="cerrar-menu" onClick={() => setMenuAbierto(false)}>X</button>
        <h2 className="categorias-header">CATEGORÍAS</h2>
        <ul className="categorias-lista">
          {categoriasData.map(categoria => (
            <li key={categoria.id}>
              <a
                href="#"
                onClick={() => {
                  setCategoriaSeleccionada(categoria.id);
                  setMenuAbierto(false); // Cierra el menú cuando se selecciona una categoría
                }}
              >
                {categoria.nombre}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-productos-categorias">
        {filtrarProductos().map(producto => (
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
        ))}
      </div>
    </div>
  );
};

export default Categorias;
