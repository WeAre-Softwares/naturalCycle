import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import '../Styles/Categorías/Categorias.css';
import {
  Buscador,
  CategoriaFiltro,
  NoHayProductos,
  ProductCard,
} from '../Components/categorias-ui';
import { useProductSearchAndPaginationCategories } from '../hooks/useProductSearchAndPaginationCategories';
import { useGetAllCategories } from '../hooks/useGetAllCategories';

export const Categorias = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [debouncedBusqueda, setDebouncedBusqueda] = useState(busqueda);

  const {
    categorias,
    loading: loadingCategorias,
    error: errorCategorias,
  } = useGetAllCategories();

  // Debounce para actualizar la búsqueda
  const handleDebouncedSearch = debounce((term) => {
    setDebouncedBusqueda(term);
  }, 600); // 600 ms de retraso

  useEffect(() => {
    handleDebouncedSearch(busqueda);
  }, [busqueda]);

  const { products, loading, error, handlePageChange, page, total } =
    useProductSearchAndPaginationCategories(
      debouncedBusqueda,
      categoriaSeleccionada,
      9,
    );

  const totalPaginas = Math.ceil(total / 9);

  const handlePrevPage = () => {
    if (page > 0) {
      handlePageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPaginas - 1) {
      handlePageChange(page + 1);
    }
  };

  return (
    <div className="container-general-categorias">
      <Buscador setBusqueda={setBusqueda} />{' '}
      {/* Este setea la búsqueda normal */}
      <CategoriaFiltro
        categorias={categorias}
        setCategoriaSeleccionada={setCategoriaSeleccionada}
        menuAbierto={menuAbierto}
        setMenuAbierto={setMenuAbierto}
      />
      <div className="container-productos-categorias">
        {loading ? (
          <p>Cargando productos...</p>
        ) : error ? (
          <p>{error}</p>
        ) : products.length > 0 ? (
          products.map((producto) => (
            <ProductCard key={producto.producto_id} producto={producto} />
          ))
        ) : (
          <NoHayProductos />
        )}
      </div>
      <div className="pagination-info">
        <p>
          Página {page + 1} de {totalPaginas}
        </p>
        <div className="botones-promocion">
          <button
            className="btn-carrusel"
            onClick={handlePrevPage}
            disabled={page === 0}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button
            className="btn-carrusel"
            onClick={handleNextPage}
            disabled={page === totalPaginas - 1}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
