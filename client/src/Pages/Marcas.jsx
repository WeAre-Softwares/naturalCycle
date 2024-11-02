import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const { marcaNombre } = useParams();
  const navigate = useNavigate();
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(marcaNombre);
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

  useEffect(() => {
    if (marcaNombre && marcas.length > 0) {
      const marcaMatch = marcas.find(
        (marca) => marca.nombre.toLowerCase() === marcaNombre.toLowerCase(),
      );
      setMarcaSeleccionada(marcaMatch ? marcaMatch.marca_id : null);
    }
  }, [marcaNombre, marcas]);

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
        setMarcaSeleccionada={(id) => {
          setMarcaSeleccionada(id);
          const marcaUrl = marcas
            .find((mar) => mar.marca_id === id)
            ?.nombre.toLowerCase()
            .replace(/\s+/g, '-');
          if (marcaUrl) navigate(`/marcas/${marcaUrl}`);
          setMenuAbierto(false);
        }}
        menuAbierto={menuAbierto}
        setMenuAbierto={setMenuAbierto}
      />
      <div className="container-productos-categorias">
        {loading ? (
          <section class="dots-container-inicio">
            <div class="dot-inicio"></div>
            <div class="dot-inicio"></div>
            <div class="dot-inicio"></div>
            <div class="dot-inicio"></div>
            <div class="dot-inicio"></div>
          </section>
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
