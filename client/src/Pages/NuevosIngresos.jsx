import React, { useState } from 'react';
import '../Styles/New/New.css';
import { IntroNuevosProductos } from '../Components/nuevos-ingresos-ui/IntroNuevosProductos';
import { PaginationControls } from '../Components/PaginationControls';
import { ProductosNuevosIngresosGrid } from '../Components/nuevos-ingresos-ui/ProductosNuevosIngresosGrid';
import { useGetAllNewArrivalProducts } from '../hooks/useGetAllNewArrivalProducts';

export const NuevoIngreso = () => {
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
        <p className="loading-message">Cargando productos nuevos...</p>
      )}

      {/* Mostrar mensaje de error */}
      {error && (
        <p className="error-message">Hubo un error al cargar los productos.</p>
      )}

      {/* Mostrar mensaje de "sin resultados" */}
      {!loading && !error && productos.length === 0 && (
        <p className="no-results-message">
          No hay productos nuevos disponibles.
        </p>
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
