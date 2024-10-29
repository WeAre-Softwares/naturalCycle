import { useState, useEffect } from 'react';
import { searchProductsService } from '../../services/products-services/search-products';

export function useSearchProducts(term, limit, offset) {
  const [productsData, setProductsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await searchProductsService(term, limit, offset);
        // console.log('Search results:', response);
        setProductsData(response);
      } catch (error) {
        setError('Error al buscar productos');
      } finally {
        setLoading(false);
      }
    };

    if (term) {
      fetchSearchResults(); // Realiza la búsqueda si hay un término
    }
  }, [term, limit, offset]); // Dependencias cuando term, limit o offset cambien

  return { productsData, loading, error };
}
