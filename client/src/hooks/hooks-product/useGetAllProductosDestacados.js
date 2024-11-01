import { useEffect, useState } from 'react';
import { getAllProductosDestacadosService } from '../../services/products-services/getAll-productosDestacados';

export function useGetAllProductosDestacados(limit = 10, page = 1) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0); // Total de productos

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const offset = (page - 1) * limit; // Calcula el offset basado en la página actual
        const response = await getAllProductosDestacadosService(limit, offset);

        if (isMounted) {
          setProductos(response.productos || []);
          setTotal(response.total || 0); // Total de productos para calcular totalPages
        }
      } catch (error) {
        console.log(error);
        setError('Error al obtener todos los productos destacados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Evita actualizaciones si el componente se desmonta
    };
  }, [limit, page]);

  const totalPages = Math.ceil(total / limit); // Calcula el total de páginas

  return { productos, loading, error, totalPages };
}
