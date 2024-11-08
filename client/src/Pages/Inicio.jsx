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
    </div>
  );
};
