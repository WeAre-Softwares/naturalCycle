import { useEffect, useState } from 'react';
import { getAllProductsSinStock } from '../../services/products-services/getAll-productsSinStock';

export function useGetProductsSinStock(limit = 10, page = 1) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const offset = (page - 1) * limit;
        const response = await getAllProductsSinStock(limit, offset);

        if (isMounted) {
          setProductos(response.productos || []);
          setTotal(response.total || 0); // Total de productos, necesario para calcular páginas
        }
      } catch (error) {
        console.error(error);
        setError('Error al obtener los productos sin stock');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [limit, page]);

  const totalPages = Math.ceil(total / limit);

  return { productos, loading, error, totalPages };
}
