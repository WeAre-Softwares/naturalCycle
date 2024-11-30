import React, { useState } from 'react';
import '../Styles/New/New.css';
import {
  IntroProductosBultoCerrado,
  ProductosBultoCerradoGrid,
} from '../Components/productos-bulto-cerrado-ui/';
import { PaginationControls } from '../Components/PaginationControls';
import { useProductsBultoCerradoSearchAndPagination } from '../hooks/hooks-product/useProductsBultoCerradoSearchAndPagination';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { NoHayProductos } from '../Components/categorias-ui/NoHayProductos';
import { Buscador } from '../Components/categorias-ui';

const LIMIT = 10;

export const ProductosPorBultoCerrado = () => {
  const [busqueda, setBusqueda] = useState('');
  const debouncedBusqueda = useDebouncedValue(busqueda, 600);
  const {
    products: productos,
    loading,
    error,
    totalPages,
    page,
    handlePageChange,
  } = useProductsBultoCerradoSearchAndPagination(debouncedBusqueda, LIMIT);

  return (
    <div className="div-general-nuevos-ingresos">
      <IntroProductosBultoCerrado />

      {/* Pasar setBusqueda al buscador */}
      <Buscador setBusqueda={setBusqueda} />

      {/* Mostrar mensaje de carga */}
      {loading && (
        <section className="dots-container-inicio">
          <div className="dot-inicio"></div>
          <div className="dot-inicio"></div>
          <div className="dot-inicio"></div>
          <div className="dot-inicio"></div>
          <div className="dot-inicio"></div>
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
          page={page + 1}
          totalPages={totalPages}
          onPrevPage={() => handlePageChange(page - 1)}
          onNextPage={() => handlePageChange(page + 1)}
        />
      )}
    </div>
  );
};
