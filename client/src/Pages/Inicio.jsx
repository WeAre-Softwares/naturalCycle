import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Inicio/Inicio.css';
import {
  BannerCarrusel,
  BannerInfoInicio,
  CategoriasTopTres,
  MarcasDestacadasGrid,
  PasosCompra,
  RedesSocialesHome,
} from '../Components/home-ui';
import { marcasDestacadasMockData, productosDestacadosMockData } from '../mock';

export const Inicio = () => {
  const [carrito, setCarrito] = useState(() => {
    const carritoLocal = JSON.parse(localStorage.getItem('carrito')) || [];
    return carritoLocal;
  });

  const navigate = useNavigate();

  const verDetallesProducto = (producto) => {
    navigate(`/producto/${producto.id}`, { state: { producto } });
  };

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

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

  const productosOrdenados = [...productosDestacadosMockData]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 8); // Limitar a 8 productos destacados

  return (
    <div className="conteiner-general-inicio">
      {/* Banner Carrusel */}
      <BannerCarrusel></BannerCarrusel>

      {/* Categorias Top tres */}
      <CategoriasTopTres />
      {/* End Top tres */}

      {/* Banner Info Inicio */}
      <BannerInfoInicio />
      {/* End Banner Info Inicio */}

      {/* Productos Destacados */}
      <div className="seccion-prod-destacados">
        <div className="container-h2-prod-destacados">
          <h2 className="titulo-pre-banner">Productos destacados</h2>
        </div>
        <div className="productos-destacados">
          {productosOrdenados.map((producto) => (
            <div className="card-producto" key={producto.id}>
              <div className="info-producto-card">
                <img
                  name={`img-producto-card-${producto.id}`}
                  className="img-producto-card"
                  src={producto.img}
                  alt={producto.nombre}
                />
                <p>(Precio por unidad)</p>
                <h2 className="nombre-producto-card">{producto.nombre}</h2>
                <h2 className="precio-producto-card">${producto.precio}</h2>
                <p>{producto.stock > 0 ? 'Stock disponible' : 'Agotado'}</p>
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
      {/* End Productos Destacados */}
      {/* Pasos Compras */}
      <PasosCompra />
      {/* End Pasos Compra */}
      {/* Marcas Destacadas */}
      <MarcasDestacadasGrid marcas={marcasDestacadasMockData} />
      {/* End Marcas Destacadas */}
      {/* Redes Social */}
      <RedesSocialesHome />
      {/* End Redes Sociales */}
    </div>
  );
};
