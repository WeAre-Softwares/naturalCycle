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
import { useGetAllMarcasDestacadas } from '../hooks/useGetAllMarcasDestacadas';
import { useGetAllProductosDestacados } from '../hooks/useGetAllProductosDestacados';

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
      {loadingProductosDestacados && <p>Cargando productos ...</p>}

      {/* Mostrar mensaje de error */}
      {errorProductosDestacados && (
        <p>Hubo un error al cargar los productos.</p>
      )}
      <ProductosDestacadosGrid productos={productos} />
      {/* End Productos Destacados */}

      {/* Pasos Compras */}
      <PasosCompra />
      {/* End Pasos Compra */}

      {/* Marcas Destacadas */}
      {/* Mostrar mensaje de carga */}
      {loadingMarcasDestacadas && <p>Cargando marcas ...</p>}

      {/* Mostrar mensaje de error */}
      {errorMarcasDestacadas && <p>Hubo un error al cargar las marcas.</p>}
      <MarcasDestacadasGrid marcas={marcas} />
      {/* End Marcas Destacadas */}

      {/* Redes Social */}
      <RedesSocialesHome />
      {/* End Redes Sociales */}
    </div>
  );
};
