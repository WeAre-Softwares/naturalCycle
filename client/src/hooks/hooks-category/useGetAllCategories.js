import { useEffect, useState } from 'react';
import { getAllCategoriesService } from '../../services/categoria-services/getAll-categories';

export function useGetAllCategories(limit = 10, offset = 0) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await getAllCategoriesService(limit, offset);
        if (isMounted) {
          // Solo actualizamos si el componente está montado
          setCategorias(response.categorias);
        }
      } catch (error) {
        console.log(error);
        setError('Error al obtener todas las categorias');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Al desmontar, evitamos futuros cambios de estado
    };
  }, [limit, offset]); // Dependencias

  return { categorias, loading, error };
}
