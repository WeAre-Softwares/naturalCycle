import { useEffect, useState } from 'react';
import { getAllProductsByCategoryService } from '../services/categoria-services/getAll-productsByCategory';

export function useGetAllProductsByCategory(
  categoriaId,
  limit = 10,
  offset = 0,
) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await getAllProductsByCategoryService(
          categoriaId,
          limit,
          offset,
        );

        if (isMounted) {
          // Solo actualizamos si el componente está montado
          setProductos(response.productos || []);
        }
      } catch (error) {
        console.log(error);
        setError('Error al obtener todos los productos por categoria');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Al desmontar, evitamos futuros cambios de estado
    };
  }, [limit, offset]); // Dependencias

  return { productos, loading, error };
}
