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
    categoriaNombre || '',
  );
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState('');
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

  // Sincronización inicial de estado solo en la primera carga
  useEffect(() => {
    if (categoriaNombre && categorias.length > 0) {
      const categoriaMatch = categorias.find(
        (categoria) =>
          categoria.nombre.toLowerCase() === categoriaNombre.toLowerCase() ||
          categoria.categoria_id === categoriaNombre,
      );

      setCategoriaSeleccionada(
        categoriaMatch ? categoriaMatch.categoria_id : '',
      );
    } else {
      setCategoriaSeleccionada('');
    }
  }, [categorias]);

  // Actualiza la URL cuando cambia la categoría seleccionada
  useEffect(() => {
    if (!categoriaSeleccionada) return;
    const categoriaUrl = categorias
      .find((cat) => cat.categoria_id === categoriaSeleccionada)
      ?.nombre.toLowerCase()
      .replace(/\s+/g, '-');
    if (categoriaUrl) navigate(`/categorias/${categoriaUrl}`);
  }, [categoriaSeleccionada, navigate]);

  const handleCategoriaChange = (id) => {
    setCategoriaSeleccionada(id);
    setMenuAbierto(false);
  };

  return (
    <div className="container-general-categorias">
      <Buscador setBusqueda={setBusqueda} />
      <CategoriaFiltro
        categorias={categorias}
        setCategoriaSeleccionada={handleCategoriaChange}
        menuAbierto={menuAbierto}
        setMenuAbierto={setMenuAbierto}
      />
      <div className="container-productos-categorias">
        {loading ? (
          <section className="dots-container-inicio">
            <div className="dot-inicio"></div>
            <div className="dot-inicio"></div>
            <div className="dot-inicio"></div>
            <div className="dot-inicio"></div>
            <div className="dot-inicio"></div>
          </section>
        ) : error ? (
          <div className="no-productos">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
          </div>
        ) : products.length > 0 ? (
          products.map((producto) => (
            <ProductCard key={producto.producto_id} producto={producto} />
          ))
        ) : (
          <NoHayProductos />
        )}
      </div>
      {/* Mostrar paginación sólo si hay al menos una página de resultados */}
      {totalPaginas > 0 && (
        <Pagination
          currentPage={page + 1}
          totalPages={totalPaginas}
          onNext={() => handlePageChange(page + 1)}
          onPrev={() => handlePageChange(page - 1)}
        />
      )}
    </div>
  );
};
