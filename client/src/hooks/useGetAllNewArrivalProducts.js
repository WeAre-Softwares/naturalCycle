import { useEffect, useState } from 'react';
import { getAllNewArrivalProductsService } from '../services/products-services/getAll-newArrivalProducts';

export function useGetAllNewArrivalProducts(limit = 10, page = 1) {
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
        const response = await getAllNewArrivalProductsService(limit, offset);

        if (isMounted) {
          // console.log(response.productos);
          setProductos(response.productos || []);
          setTotal(response.total || 0); // Total de productos, necesario para calcular páginas
        }
      } catch (error) {
        console.log(error);
        setError('Error al obtener todos los nuevos ingresos de productos');
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
