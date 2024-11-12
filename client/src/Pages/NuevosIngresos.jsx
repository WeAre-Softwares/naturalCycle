import React, { useState } from 'react';
import '../Styles/New/New.css';
import { IntroNuevosProductos } from '../Components/nuevos-ingresos-ui/IntroNuevosProductos';
import { PaginationControls } from '../Components/PaginationControls';
import { ProductosNuevosIngresosGrid } from '../Components/nuevos-ingresos-ui/ProductosNuevosIngresosGrid';
import { useGetAllNewArrivalProducts } from '../hooks/hooks-product/useGetAllNewArrivalProducts';
import { NoHayProductos } from '../Components/categorias-ui/NoHayProductos';

export const NuevosIngresos = () => {
  const [page, setPage] = useState(1);
  const { productos, loading, error, totalPages } = useGetAllNewArrivalProducts(
    5,
    page,
  );

  // Manejo de cambio de página
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="div-general-nuevos-ingresos">
      <IntroNuevosProductos />

      {/* Mostrar mensaje de carga */}
      {loading && (
        <section class="dots-container-inicio">
          <div class="dot-inicio"></div>
          <div class="dot-inicio"></div>
          <div class="dot-inicio"></div>
          <div class="dot-inicio"></div>
          <div class="dot-inicio"></div>
        </section>
      )}

      {/* Mostrar mensaje de error */}
      {error && (
        <div className="no-productos">
          <i className="fas fa-exclamation-circle"></i>
          <p>Error al obtener productos.</p>
        </div>
      )}

      {/* Mostrar mensaje de "sin resultados" */}
      {!loading && !error && productos.length === 0 && (
        <NoHayProductos></NoHayProductos>
      )}

      {/* Mostrar grid de productos solo si hay resultados */}
      {!loading && !error && productos.length > 0 && (
        <ProductosNuevosIngresosGrid productos={productos} />
      )}

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
    </div>
  );
};
