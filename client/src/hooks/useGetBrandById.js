import { useEffect, useState } from 'react';
import { getMarcaByIdService } from '../services/marca-services/getById-marca';

export function useGetBrandById(marca_id) {
  const [marca, setMarca] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarca = async () => {
      try {
        const data = await getMarcaByIdService(marca_id);

        setMarca(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarca();
  }, [marca_id]); // Dependencia

  return { marca, loading, error };
}
