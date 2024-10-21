import React, { useState, useEffect, useRef } from 'react';
import '../Styles/Promociones/Promociones.css';
import { useNavigate } from 'react-router-dom';

const productosPromocion = [
  { id: 1, nombre: 'Producto 1', precio: 100, stock: 10, img: '/Imagenes/producto-banner.png' },
  { id: 2, nombre: 'Producto 2', precio: 200, stock: 5, img: '/Imagenes/producto-banner.png' },
  { id: 3, nombre: 'Producto 3', precio: 300, stock: 8, img: '/Imagenes/producto-banner.png' },
  { id: 4, nombre: 'Producto 4', precio: 400, stock: 0, img: '/Imagenes/producto-banner.png' },
  { id: 5, nombre: 'Producto 5', precio: 500, stock: 2, img: '/Imagenes/producto-banner.png' },
  { id: 6, nombre: 'Producto 6', precio: 600, stock: 7, img: '/Imagenes/producto-banner.png' },
  { id: 7, nombre: 'Producto 7', precio: 700, stock: 0, img: '/Imagenes/producto-banner.png' },
  { id: 8, nombre: 'Producto 8', precio: 800, stock: 9, img: '/Imagenes/producto-banner.png' },
  { id: 9, nombre: 'Producto 9', precio: 900, stock: 6, img: '/Imagenes/producto-banner.png' },
  { id: 10, nombre: 'Producto 10', precio: 1000, stock: 4, img: '/Imagenes/producto-banner.png' },
  { id: 11, nombre: 'Producto 11', precio: 2000, stock: 3, img: '/Imagenes/producto-banner.png' },
  { id: 12, nombre: 'Producto 12', precio: 3000, stock: 2, img: '/Imagenes/producto-banner.png' },
  { id: 13, nombre: 'Producto 13', precio: 4000, stock: 4, img: '/Imagenes/producto-banner.png' },
  { id: 14, nombre: 'Producto 14', precio: 5000, stock: 4, img: '/Imagenes/producto-banner.png' },
  { id: 15, nombre: 'Producto 15', precio: 6000, stock: 5, img: '/Imagenes/producto-banner.png' },
  { id: 16, nombre: 'Producto 16', precio: 7000, stock: 4, img: '/Imagenes/producto-banner.png' },
  { id: 17, nombre: 'Producto 17', precio: 8000, stock: 8, img: '/Imagenes/producto-banner.png' },
  { id: 18, nombre: 'Producto 18', precio: 9000, stock: 0, img: '/Imagenes/producto-banner.png' },
  { id: 19, nombre: 'Producto 19', precio: 10000, stock: 4, img: '/Imagenes/producto-banner.png' },

];

export const Promociones = () => {
  const [productosPorPagina] = useState(8); // Siempre 8 productos por página
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const carruselRef = useRef(null);

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
    const productoExistente = nuevoCarrito.find(item => item.id === producto.id);

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

  // Ordenar productos para que los agotados aparezcan al final
  const productosOrdenados = [...productosPromocion].sort((a, b) => {
    return (a.stock === 0) - (b.stock === 0);
  });

  // Calcular total de páginas
  useEffect(() => {
    const totalPages = Math.ceil(productosOrdenados.length / productosPorPagina);
    setTotalPaginas(totalPages);
  }, [productosPorPagina, productosOrdenados.length]);

  const handlePrevPage = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const handleNextPage = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  };

  // Obtener los productos de la página actual
  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const productosPaginaActual = productosOrdenados.slice(indiceInicio, indiceInicio + productosPorPagina);

  return (
    <div className="container-general-promociones">
      <div className="container-h2-promociones">
        <h2>PROMOCIONES</h2>
        <h4>
          Descubre nuestras ofertas especiales y promociones diseñadas para brindarte los mejores productos al mejor precio.
          Aquí encontrarás descuentos exclusivos en una amplia variedad de artículos, seleccionados cuidadosamente para satisfacer
          todas tus necesidades. ¡Aprovecha estas oportunidades antes de que se agoten y lleva lo mejor a tu hogar!
        </h4>
      </div>

      <div className="carrusel-promociones">
        

        <div className="productos-carrusel" ref={carruselRef}>
          {productosPaginaActual.map((producto) => (
            <div className="card-producto" key={producto.id}>
              <img name={`img-producto-card-${producto.id}`} className="img-producto-card" src={producto.img} alt={producto.nombre} />
              <p name={`tipo-precio-producto-${producto.id}`}>Precio por unidad</p>
              <h3 className="nombre-producto-card" name={`nombre-producto-card-${producto.id}`}>{producto.nombre}</h3>
              <h3 className="precio-producto-card" name={`precio-producto-card-${producto.id}`}>${producto.precio}</h3>
              <p>{producto.stock > 0 ? `Stock disponible` : 'Agotado'}</p>

              <div className="botones-card-producto">
                <button disabled={producto.stock === 0} onClick={() => agregarAlCarrito(producto)}>
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

      <div className="pagination-info">
        <p>Página {paginaActual} de {totalPaginas}</p>
        <div className="botones-promocion">
        <button className="btn-carrusel" onClick={handlePrevPage} disabled={paginaActual === 1}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button className="btn-carrusel" onClick={handleNextPage} disabled={paginaActual === totalPaginas}>
          <i className="fa-solid fa-chevron-right"></i>
        </button>
        </div>
      </div>
    </div>
  );
};
