import { useEffect, useState } from 'react';
import { getEtiquetaByIdService } from '../services/etiquetas-service/getById-etiqueta';

export function useGetEtiquetaById(etiqueta_id) {
  const [etiqueta, setEtiqueta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEtiqueta = async () => {
      try {
        const data = await getEtiquetaByIdService(etiqueta_id);

        setEtiqueta(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEtiqueta();
  }, [etiqueta_id]); // Dependencia

  return { etiqueta, loading, error };
}
