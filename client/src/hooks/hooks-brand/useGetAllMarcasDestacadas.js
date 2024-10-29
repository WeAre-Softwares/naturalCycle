import { useEffect, useState } from 'react';
import { getAllMarcasDestacadasService } from '../../services/marca-services/getAll-marcasDestacadas';

export function useGetAllMarcasDestacadas(limit = 10, offset = 0) {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await getAllMarcasDestacadasService(limit, offset);
        if (isMounted) {
          // Solo actualizamos si el componente está montado
          setMarcas(response.marcas || []);
        }
      } catch (error) {
        console.log(error);
        setError('Error al obtener todos los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Al desmontar, evitamos futuros cambios de estado
    };
  }, [limit, offset]); // Dependencias

  return { marcas, loading, error };
}
