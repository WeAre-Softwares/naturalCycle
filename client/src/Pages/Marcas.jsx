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
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(marcaNombre || '');
  const [menuAbierto, setMenuAbierto] = useState(true); // Iniciar con el menú abierto
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
        marcas={marcas}
        setMarcaSeleccionada={handleMarcaChange}
        menuAbierto={menuAbierto}
        setMenuAbierto={setMenuAbierto}
      />
      <Buscador setBusqueda={setBusqueda} />
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
