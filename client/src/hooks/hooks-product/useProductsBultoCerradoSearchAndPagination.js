import { useState, useEffect } from 'react';
import { getAllProductsByBultoCerrado } from '../../services/products-services/getBultoCerradoProducts';
import { searchProductsBultoCerradoService } from '../../services/products-services/search-productsBultoCerrado';

export function useProductsBultoCerradoSearchAndPagination(term = '', limit) {
  const [page, setPage] = useState(0);
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Actualiza el offset cada vez que cambia la página
  useEffect(() => {
    setOffset(page * limit);
  }, [page, limit]);

  // Reinicia la paginación cuando cambia la búsqueda
  useEffect(() => {
    setPage(0);
  }, [term]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = term
          ? await searchProductsBultoCerradoService(term, limit, offset) // Caso de búsqueda
          : await getAllProductsByBultoCerrado(limit, offset); // Caso de todos los productos de bulto cerrado

        setData(response);
      } catch (error) {
        setError('Error al obtener productos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [term, limit, offset]);

  // Función para cambiar de página
  const handlePageChange = (newPage) => setPage(newPage);

  // Calcula el total de páginas
  const totalPages = Math.ceil((data?.total || 0) / limit);

  return {
    products: data?.productos || [],
    total: data?.total || 0,
    totalPages,
    page,
    handlePageChange,
    loading,
    error,
  };
}
