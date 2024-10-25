import { useEffect, useState } from 'react';
import { getAllProductosDestacadosService } from '../services/products-services/getAll-productosDestacados';

export function useGetAllProductosDestacados(limit = 10, offset = 0) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await getAllProductosDestacadosService(limit, offset);

        if (isMounted) {
          // Solo actualizamos si el componente está montado
          setProductos(response.productos || []);
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
      isMounted = false; // Al desmontar, evitamos futuros cambios de estado
    };
  }, [limit, offset]); // Dependencias

  return { productos, loading, error };
}
