import { useState, useEffect } from 'react';
import { searchProductsService } from '../../services/products-services/search-products';
import { getAllProductsByCategoryService } from '../../services/categoria-services/getAll-productsByCategory';
import { getAllProductsService } from '../../services/products-services/getAll-products';

export function useProductSearchAndPaginationCategories(
  term = '',
  categoriaNombre = '',
  limit = 10,
) {
  const [page, setPage] = useState(0);
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Actualiza el offset cada vez que cambia la página
  useEffect(() => {
    setOffset(page * limit);
  }, [page, limit]);

  // Reinicia la paginación cuando cambia la búsqueda o la categoría
  useEffect(() => {
    setPage(0);
  }, [term, categoriaNombre]);

  // Fetch de productos basado en el escenario de búsqueda/filtrado
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;
        if (term) {
          // Caso de búsqueda por término
          response = await searchProductsService(term, limit, offset);
        } else if (categoriaNombre) {
          // Caso de búsqueda por categoría
          response = await getAllProductsByCategoryService(
            categoriaNombre,
            limit,
            offset,
          );
        } else {
          // Caso de obtener todos los productos
          response = await getAllProductsService(limit, offset);
        }

        setData(response);
      } catch (error) {
        setError('Error al obtener productos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [term, categoriaNombre, limit, offset]);

  // Función para cambiar de página
  const handlePageChange = (newPage) => setPage(newPage);

  return {
    products: data?.productos || [],
    total: data?.total || 0,
    page,
    handlePageChange,
    loading,
    error,
  };
}
