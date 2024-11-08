import React, { useState, useEffect } from 'react';
import '../Styles/Inicio/Inicio.css';
import {
  BannerCarrusel,
  BannerInfoInicio,
  CategoriasTopTres,
  MarcasDestacadasGrid,
  PasosCompra,
  ProductosDestacadosGrid,
  RedesSocialesHome,
} from '../Components/home-ui';
// import { marcasDestacadasMockData, productosDestacadosMockData } from '../mock';
import { useGetAllMarcasDestacadas } from '../hooks/hooks-brand/useGetAllMarcasDestacadas';
import { useGetAllProductosDestacados } from '../hooks/hooks-product/useGetAllProductosDestacados';
import { Pagination } from '../Components/panel-productos/Pagination';
import { NewLogo } from '../Components/New-logo';

export const Inicio = () => {
  const limitMarcas = 12;
  const limitProductos = 9;
  const ofsset = 0;
  const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
  const {
    marcas = [],
    error: errorMarcasDestacadas,
    loading: loadingMarcasDestacadas,
  } = useGetAllMarcasDestacadas(limitMarcas, ofsset);

  const {
    productos,
    loading: loadingProductosDestacados,
    error: errorProductosDestacados,
    totalPages,
  } = useGetAllProductosDestacados(limitProductos, currentPage);

  // Funciones para manejar la paginación
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="conteiner-general-inicio">
      {/* Banner Carrusel */}
      <BannerCarrusel />
      {/* Categorias Top tres */}
      <CategoriasTopTres />
      {/* Banner Info Inicio */}
      <BannerInfoInicio />

      {/* Productos Destacados */}
      {loadingProductosDestacados ? (
        <section className="dots-container-inicio">
          <div className="dot-inicio"></div>
          <div className="dot-inicio"></div>
          <div className="dot-inicio"></div>
          <div className="dot-inicio"></div>
          <div className="dot-inicio"></div>
        </section>
      ) : (
        <>
          <ProductosDestacadosGrid productos={productos} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={handleNextPage}
            onPrev={handlePrevPage}
          />
        </>
      )}

      {errorProductosDestacados && (
        <div className="no-productos">
          <i className="fas fa-exclamation-circle"></i>
          <p>Hubo un error al cargar los productos.</p>
        </div>
      )}

      {/* Pasos Compras */}
      <PasosCompra />

      {/* Marcas Destacadas */}
      {loadingMarcasDestacadas ? (
        <section className="dots-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </section>
      ) : (
        <MarcasDestacadasGrid marcas={marcas} />
      )}
      {errorMarcasDestacadas && (
        <div className="no-productos">
          <i className="fas fa-exclamation-circle"></i>
          <p>Hubo un error al cargar las marcas.</p>
        </div>
      )}

      {/* Redes Social */}
      <RedesSocialesHome />
      <div className="container-card-info-usuario">
      <h2 className="h2-card-info-usuario">Datos de usuario</h2>
      <div className="container-datos-usuario-card">
        <i className="fa-solid fa-user"></i>
        <p>ID Usuario: 12</p>
        <p>Nombre: Julian</p>
        <p>Apellido: Sanchez</p>
        <p>DNI: 45.888.222</p>
        <p>Nombre del comercio: Dietetica Sanchez</p>
        <p>Teléfono: 213123121231</p>
        <p>Email: julian@gmail.com</p>
      </div>
      <button className="Btn-cerrar-sesion">
        <div className="sign-cerrar-sesion">
          <svg viewBox="0 0 512 512">
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
          </svg>
        </div>
        <h3>Cerrar sesión</h3>
      </button>
    </div>
    </div>
  );
};
