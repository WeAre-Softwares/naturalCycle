import { useEffect, useState } from 'react';
import { getAllMarcasService } from '../services/marca-services/getAll-marcas';

export function useGetAllMarcas(limit = 10, offset = 0) {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await getAllMarcasService(limit, offset);
        if (isMounted) {
          // Solo actualizamos si el componente está montado
          // console.log(response);
          setMarcas(response.marcas);
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
