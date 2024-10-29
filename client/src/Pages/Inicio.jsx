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

export const Inicio = () => {
  const limitMarcas = 12;
  const limitProductos = 12;
  const ofsset = 0;
  const {
    marcas = [],
    error: errorMarcasDestacadas,
    loading: loadingMarcasDestacadas,
  } = useGetAllMarcasDestacadas(limitMarcas, ofsset);

  const {
    productos = [],
    loading: loadingProductosDestacados,
    error: errorProductosDestacados,
  } = useGetAllProductosDestacados(limitProductos, ofsset);

  //TODO: Agregar funcionalidad carrito de compras

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
      {/* Mostrar mensaje de carga */}
      {loadingProductosDestacados && <section class="dots-container-inicio">
            <div class="dot-inicio"></div>
            <div class="dot-inicio"></div>
            <div class="dot-inicio"></div>
            <div class="dot-inicio"></div>
            <div class="dot-inicio"></div>
          </section>}


          <ProductosDestacadosGrid productos={productos} />
          {/* End Productos Destacados */}
       
      {/* Mostrar mensaje de error */}
      {errorProductosDestacados && (
        <div className="no-productos">
        <i className="fas fa-exclamation-circle"></i><p>Hubo un error al cargar los productos.</p>
        </div>
      )}
      

      {/* Pasos Compras */}
      <PasosCompra />
      {/* End Pasos Compra */}

      {/* Marcas Destacadas */}
      {/* Mostrar mensaje de carga */}
      {loadingMarcasDestacadas && <section class="dots-container">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </section>}

      {/* Mostrar mensaje de error */}
      <MarcasDestacadasGrid marcas={marcas} />
      {errorMarcasDestacadas && <div className="no-productos"><i className="fas fa-exclamation-circle"></i><p>Hubo un error al cargar las marcas.</p></div>}
      {/* End Marcas Destacadas */}

      {/* Redes Social */}
      <RedesSocialesHome />
      {/* End Redes Sociales */}
    </div>
  );
};
