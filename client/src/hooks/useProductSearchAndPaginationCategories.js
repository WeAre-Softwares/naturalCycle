import { useState, useEffect } from 'react';
import { getAllProductsService } from '../services/products-services/getAll-products';
import { searchProductsService } from '../services/products-services/search-products';
import { getAllProductsByCategoryService } from '../services/categoria-services/getAll-productsByCategory';

export function useProductSearchAndPaginationCategories(
  term = '',
  categoriaId = '',
  limit = 9,
) {
  const [page, setPage] = useState(0);
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Actualiza offset cuando cambia la página
  useEffect(() => {
    setOffset(page * limit);
  }, [page, limit]);

  // Reinicia la paginación al cambiar la búsqueda o la categoría
  useEffect(() => {
    setPage(0);
  }, [term, categoriaId]);

  // Determina y ejecuta la lógica de búsqueda
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let response;
        if (term) {
          // Caso de búsqueda
          response = await searchProductsService(term, limit, offset);
        } else if (categoriaId) {
          // Caso de filtrado por categoría
          response = await getAllProductsByCategoryService(
            categoriaId,
            limit,
            offset,
          );
        } else {
          // Caso de productos generales
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
  }, [term, categoriaId, limit, offset]);

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
