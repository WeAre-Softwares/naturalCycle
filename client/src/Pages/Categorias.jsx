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
import useCategoria from '../context/categorias/useCategoriasContext';
import useMarca from '../context/marcas/useMarcaContext';

const LIMIT = 10;

export const Categorias = () => {
  const { categoriaNombre } = useParams();
  const navigate = useNavigate();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    categoriaNombre || '',
  );
  const [busqueda, setBusqueda] = useState('');
  const debouncedBusqueda = useDebouncedValue(busqueda, 600);
  const { orderBy } = useCategoria()
  
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

  const handleSorting = () => {
    let sorted = [...products];

    sorted.sort((a, b) => {
      const parsePrice = (price) => {
        const parsed = parseFloat(price)
        return isNaN(parsed) ? 0 : parsed
      }

      const priceA = parsePrice(a.precio)
      const priceB = parsePrice(b.precio)

      switch (orderBy) {
        case 'precio_desc': return priceA - priceB;
        case 'precio_asc': return priceB - priceA;
        case 'nombre_asc': return a.nombre.localeCompare(b.nombre);
        case 'nombre_desc': return b.nombre.localeCompare(a.nombre);
        default: return 0
      }
    })

    return sorted
  }

  const sortedProducts = handleSorting()

  // Inicializa la categoría seleccionada desde la URL
  useEffect(() => {
    if (categoriaNombre) {
      setCategoriaSeleccionada(categoriaNombre);
    }
  }, [categoriaNombre]);

  // Actualiza la URL cuando cambia la categoría seleccionada
  const handleCategoriaChange = (categoria) => {
    setCategoriaSeleccionada(categoria);
    navigate(`/categorias/${categoria}`);
  };

  return (
    <div className="container-general-categorias">
      <CategoriaFiltro
        loading={loadingCategorias}
        categorias={categorias}
        setCategoriaSeleccionada={handleCategoriaChange}
      />
      <Buscador setBusqueda={setBusqueda} />
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
        ) : sortedProducts.length > 0 ? (
          sortedProducts.map((producto) => (
            <ProductCard key={producto.producto_id} producto={producto} />
          ))
        ) : (
          <NoHayProductos />
        )}
      </div>
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
