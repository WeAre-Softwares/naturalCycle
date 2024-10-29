import React, { useState } from 'react';
import '../Styles/Marcas/Marcas.css';
import {
  Buscador,
  NoHayProductos,
  ProductCard,
} from '../Components/categorias-ui';
import { Pagination } from '../Components/panel-productos/Pagination';
import { MarcasFiltro } from '../Components/marcas-ui/MarcasFiltro';
import { useProductSearchAndPaginationBrand } from '../hooks/hooks-brand/useProductSearchAndPaginationBrand';
import { useGetAllBrands } from '../hooks/hooks-brand/useGetAllBrands';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

// Límite de productos para centralizar su valor
const LIMIT = 9;

export const Marcas = () => {
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // Debounced valor busqueda
  const debouncedBusqueda = useDebouncedValue(busqueda, 600);

  const {
    marcas,
    loading: loadingMarcas,
    error: errorMarcas,
  } = useGetAllBrands();

  const { products, loading, error, handlePageChange, page, total } =
    useProductSearchAndPaginationBrand(
      debouncedBusqueda,
      marcaSeleccionada,
      LIMIT,
    );

  const totalPaginas = Math.ceil(total / LIMIT);

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
      <Buscador setBusqueda={setBusqueda} />
      <MarcasFiltro
        marcas={marcas}
        setMarcaSeleccionada={setMarcaSeleccionada}
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
      <Pagination
        currentPage={page + 1}
        totalPages={totalPaginas}
        onNext={() => handlePageChange(page + 1)}
        onPrev={() => handlePageChange(page - 1)}
      />
    </div>
  );
};
