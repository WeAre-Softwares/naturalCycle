import React, { useEffect, useMemo, useState } from 'react';
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
import useMarca from '../context/marcas/useMarcaContext';
import _ from 'lodash'

// Límite de productos para centralizar su valor
const LIMIT = 10;

export const Marcas = () => {
  const { marcaNombre } = useParams();
  const navigate = useNavigate();
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(marcaNombre || '');
  const [busqueda, setBusqueda] = useState('');
  const { orderBy } = useMarca()

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
    if (marcaNombre) {
      setMarcaSeleccionada(marcaNombre);
    }
  }, [marcaNombre]);

  // Actualiza la URL cuando cambia la marca seleccionada
  const handleMarcaChange = (marca) => {
    setMarcaSeleccionada(marca);
    navigate(`/marcas/${marca}`);
  };

  return (
    <div className="container-general-categorias">
      <MarcasFiltro
        loading={loadingMarcas}
        marcas={marcas}
        setMarcaSeleccionada={handleMarcaChange}
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
