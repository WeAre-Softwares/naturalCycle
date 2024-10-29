import { useEffect, useState } from 'react';
import { getCategoryByIdService } from '../../services/categoria-services/getById-category';

export function useGetCategoryById(categoria_id) {
  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const data = await getCategoryByIdService(categoria_id);

        setCategoria(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoria();
  }, [categoria_id]); // Dependencia

  return { categoria, loading, error };
}
