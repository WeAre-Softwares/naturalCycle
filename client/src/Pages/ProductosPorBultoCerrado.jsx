import React, { useState } from 'react';
import '../Styles/New/New.css';
import {
  IntroProductosBultoCerrado,
  ProductosBultoCerradoGrid,
} from '../Components/productos-bulto-cerrado-ui/';
import { PaginationControls } from '../Components/PaginationControls';
import { useGetBultoCerradoProducts } from '../hooks/hooks-product/useGetBultoCerradoProducts';
import { NoHayProductos } from '../Components/categorias-ui/NoHayProductos';

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
          <p>Error al obtener los productos.</p>
        </div>
      )}

      {/* Mostrar mensaje de "sin resultados" */}
      {!loading && !error && productos.length === 0 && (
        <NoHayProductos></NoHayProductos>
      )}

      {/* Mostrar grid de productos solo si hay resultados */}
      {!loading && !error && productos.length > 0 && (
        <ProductosBultoCerradoGrid productos={productos} />
      )}

      {/* Mostrar paginación sólo si hay al menos una página de resultados */}
      {totalPages > 0 && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      )}
    </div>
  );
};
