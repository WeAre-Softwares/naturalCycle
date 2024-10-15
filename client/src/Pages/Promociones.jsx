import React, { useState, useEffect, useRef } from 'react';
import '../Styles/Promociones/Promociones.css';
import { useNavigate } from 'react-router-dom'; // Asegúrate de importar useNavigate


const productosPromocion = [
  {
    id: 1,
    nombre: 'Producto 1',
    precio: 100,
    stock: 10,
    img: '/Imagenes/producto-banner.png',
  },
  {
    id: 2,
    nombre: 'Producto 2',
    precio: 200,
    stock: 5,
    img: '/Imagenes/producto-banner.png',
  },
  {
    id: 3,
    nombre: 'Producto 3',
    precio: 300,
    stock: 8,
    img: '/Imagenes/producto-banner.png',
  },
  {
    id: 4,
    nombre: 'Producto 4',
    precio: 400,
    stock: 0,
    img: '/Imagenes/producto-banner.png',
  },
  {
    id: 5,
    nombre: 'Producto 5',
    precio: 500,
    stock: 2,
    img: '/Imagenes/producto-banner.png',
  },
  {
    id: 6,
    nombre: 'Producto 6',
    precio: 600,
    stock: 7,
    img: '/Imagenes/producto-banner.png',
  },
  {
    id: 7,
    nombre: 'Producto 7',
    precio: 700,
    stock: 0,
    img: '/Imagenes/producto-banner.png',
  },
  {
    id: 8,
    nombre: 'Producto 8',
    precio: 800,
    stock: 9,
    img: '/Imagenes/producto-banner.png',
  },
  {
    id: 9,
    nombre: 'Producto 9',
    precio: 900,
    stock: 6,
    img: '/Imagenes/producto-banner.png',
  },
  {
    id: 10,
    nombre: 'Producto 10',
    precio: 1000,
    stock: 4,
    img: '/Imagenes/producto-banner.png',
  },
];

export const Promociones = () => {
  const [productosPorPagina, setProductosPorPagina] = useState(1); // Muestra 1 producto por defecto
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

  // Ordenar productos para que los agotados aparezcan al final
  const productosOrdenados = [...productosPromocion].sort((a, b) => {
    return (a.stock === 0) - (b.stock === 0);
  });


  useEffect(() => {
    const updateProductosPorPagina = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setProductosPorPagina(1); // Muestra 1 producto en pantallas pequeñas
      } else if (width < 900) {
        setProductosPorPagina(2); // Muestra 2 productos en pantallas medianas
      } else if (width < 1200) {
        setProductosPorPagina(4); // Muestra 4 productos en pantallas grandes
      } else {
        setProductosPorPagina(8); // Muestra 8 productos en pantallas muy grandes
      }
    };

    // Actualiza al montar y al cambiar el tamaño de la ventana
    updateProductosPorPagina();
    window.addEventListener('resize', updateProductosPorPagina);

    return () => window.removeEventListener('resize', updateProductosPorPagina);
  }, []);

  const handlePrevClick = () => {
    carruselRef.current.scrollBy({
      left: -carruselRef.current.offsetWidth,
      behavior: 'smooth',
    });
  };

  const handleNextClick = () => {
    carruselRef.current.scrollBy({
      left: carruselRef.current.offsetWidth,
      behavior: 'smooth',
    });
  };

  return (
    <div className="container-general-promociones">
      <div className="container-h2-promociones">
        <h2>PROMOCIONES</h2>
        <h4>
          Descubre nuestras ofertas especiales y promociones diseñadas para
          brindarte los mejores productos al mejor precio. Aquí encontrarás
          descuentos exclusivos en una amplia variedad de artículos,
          seleccionados cuidadosamente para satisfacer todas tus necesidades.
          ¡Aprovecha estas oportunidades antes de que se agoten y lleva lo mejor
          a tu hogar!
        </h4>
      </div>

      <div className="carrusel-promociones">
        <button className="btn-carrusel" onClick={handlePrevClick}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        <div className="productos-carrusel" ref={carruselRef}>
          {productosOrdenados.map((producto) => (
            <div className="card-producto" key={producto.id}>
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

        <button className="btn-carrusel" onClick={handleNextClick}>
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};
