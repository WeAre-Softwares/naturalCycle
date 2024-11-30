import React, { useState } from 'react';
import '../Styles/New/New.css';
import {
  IntroProductosBultoCerrado,
  ProductosBultoCerradoGrid,
} from '../Components/productos-bulto-cerrado-ui/';
import { PaginationControls } from '../Components/PaginationControls';
import { useGetBultoCerradoProducts } from '../hooks/hooks-product/useGetBultoCerradoProducts';
import { NoHayProductos } from '../Components/categorias-ui/NoHayProductos';
import { Buscador } from '../Components/categorias-ui';

export const ProductosPorBultoCerrado = () => {
  const [page, setPage] = useState(1);
  const [busqueda, setBusqueda] = useState(''); // Estado de búsqueda
  const { productos, loading, error, totalPages } = useGetBultoCerradoProducts(
    8,
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

  // Filtrar productos según el término de búsqueda
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

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
      {!loading && !error && productosFiltrados.length === 0 && (
        <NoHayProductos></NoHayProductos>
      )}

      {/* Mostrar grid de productos solo si hay resultados */}
      {!loading && !error && productosFiltrados.length > 0 && (
        <ProductosBultoCerradoGrid productos={productosFiltrados} />
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
