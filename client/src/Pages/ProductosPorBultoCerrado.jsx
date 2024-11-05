import React, { useState } from 'react';
import '../Styles/New/New.css';
import {
  IntroProductosBultoCerrado,
  ProductosBultoCerradoGrid,
} from '../Components/productos-bulto-cerrado-ui/';
import { PaginationControls } from '../Components/PaginationControls';
import { useGetBultoCerradoProducts } from '../hooks/hooks-product/useGetBultoCerradoProducts';

export const ProductosPorBultoCerrado = () => {
  const [page, setPage] = useState(1);
  const { productos, loading, error, totalPages } = useGetBultoCerradoProducts(
    9,
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
      <IntroProductosBultoCerrado />

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
          <p>Hubo un error al cargar los productos.</p>
        </div>
      )}

      {/* Mostrar mensaje de "sin resultados" */}
      {!loading && !error && productos.length === 0 && (
        <p className="no-results-message">No hay productos disponibles.</p>
      )}

      {/* Mostrar grid de productos solo si hay resultados */}
      {!loading && !error && productos.length > 0 && (
        <ProductosBultoCerradoGrid productos={productos} />
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
