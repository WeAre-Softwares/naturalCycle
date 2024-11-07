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

      <div className="pag-pedido-card">
        
  <div className="div-pedido-card">
  <button className="button-volver-panel-producto">  {/*ESTE BOTÓN DEBE VOLVER AL AREA DE PEDIDOS*/}
            <i class="fas fa-arrow-left"></i>
            &nbsp;&nbsp;Volver
          </button>
    <h2 className="h2-pedido-card">Detalles del Pedido</h2>
    
    <div className="div-section-pedido-card">
      <p className="p-pedido-card"><strong>ID del Pedido:</strong> 12345</p>
      <p className="p-pedido-card"><strong>Estado:</strong> En Proceso</p>
      <p className="p-pedido-card"><strong>Fecha:</strong> 06/11/2024</p>
      <p className="p-pedido-card"><strong>Está activo:</strong> True</p>
    </div>
    
    <div className="div-global-pedido-card">
      <div className="div-section-pedido-card">
      <h3 className="h3-pedido-card">Producto</h3>
      <p className="p-pedido-card"><strong>Nombre:</strong> Manzanas Orgánicas</p>
      <p className="p-pedido-card"><strong>Descripción:</strong> Manzanas frescas y orgánicas cultivadas sin pesticidas.</p>
      <p className="p-pedido-card"><strong>Cantidad:</strong> 7</p>
      <p className="p-pedido-card"><strong>Precio:</strong> $2.500</p></div>
      <div className="div-section-pedido-card">
      <h3 className="h3-pedido-card">Producto</h3>
      <p className="p-pedido-card"><strong>Nombre:</strong> Manzanas Orgánicas</p>
      <p className="p-pedido-card"><strong>Descripción:</strong> Manzanas frescas y orgánicas cultivadas sin pesticidas.</p>
      <p className="p-pedido-card"><strong>Cantidad:</strong> 7</p>
      <p className="p-pedido-card"><strong>Precio:</strong> $2.500</p></div>
      <div className="div-section-pedido-card">
      <h3 className="h3-pedido-card">Producto</h3>
      <p className="p-pedido-card"><strong>Nombre:</strong> Manzanas Orgánicas</p>
      <p className="p-pedido-card"><strong>Descripción:</strong> Manzanas frescas y orgánicas cultivadas sin pesticidas.</p>
      <p className="p-pedido-card"><strong>Cantidad:</strong> 7</p>
      <p className="p-pedido-card"><strong>Precio:</strong> $2.500</p></div>
    </div>
    
    <div className="div-section-pedido-card">
      <h3 className="h3-pedido-card">Resumen</h3>
      <p className="p-pedido-card"><strong>Cantidad:</strong> 3</p>
      <p className="p-pedido-card"><strong>Total Precio:</strong> $7.500</p>
    </div>
  </div>
</div>

    </div>
  );
};
