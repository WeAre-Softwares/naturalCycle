import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../Styles/Categorías/Categorias.css';
import {
  Buscador,
  CategoriaFiltro,
  NoHayProductos,
  ProductCard,
} from '../Components/categorias-ui';
import { Pagination } from '../Components/panel-productos/Pagination';
import { useProductSearchAndPaginationCategories } from '../hooks/hooks-category/useProductSearchAndPaginationCategories';
import { useGetAllCategories } from '../hooks/hooks-category/useGetAllCategories';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

// Límite de productos para centralizar su valor
const LIMIT = 9;

export const Categorias = () => {
  const { categoriaNombre } = useParams();
  const navigate = useNavigate();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    categoriaNombre || null,
  ); // categoriaNombre para inicializar el estado
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  // Debounced valor de busqueda
  const debouncedBusqueda = useDebouncedValue(busqueda, 600);

  const {
    categorias,
    loading: loadingCategorias,
    error: errorCategorias,
  } = useGetAllCategories();

  const { products, loading, error, handlePageChange, page, total } =
    useProductSearchAndPaginationCategories(
      debouncedBusqueda,
      categoriaSeleccionada,
      LIMIT,
    );

  const totalPaginas = Math.ceil(total / LIMIT);

  useEffect(() => {
    if (categoriaNombre && categorias.length > 0) {
      const categoriaMatch = categorias.find(
        (categoria) =>
          categoria.nombre.toLowerCase() === categoriaNombre.toLowerCase(),
      );
      setCategoriaSeleccionada(
        categoriaMatch ? categoriaMatch.categoria_id : null,
      );
    }
  }, [categoriaNombre, categorias]);

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
      <CategoriaFiltro
        categorias={categorias}
        setCategoriaSeleccionada={(id) => {
          setCategoriaSeleccionada(id);
          const categoriaUrl = categorias
            .find((cat) => cat.categoria_id === id)
            ?.nombre.toLowerCase()
            .replace(/\s+/g, '-');
          if (categoriaUrl) navigate(`/categorias/${categoriaUrl}`);
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
