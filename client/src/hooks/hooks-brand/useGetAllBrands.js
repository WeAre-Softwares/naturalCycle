import { useEffect, useState } from 'react';
import { getAllMarcasService } from '../../services/marca-services/getAll-marcas';

// !El limit al no darle un valor trae todos los registros de marcas por defecto.
export function useGetAllBrands(limit, offset = 0) {
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
