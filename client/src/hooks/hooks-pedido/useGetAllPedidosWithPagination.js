import { useEffect, useState } from 'react';
import { getAllPedidosService } from '../../services/pedidos-service/getAll-pedidos';
import useAuthStore from '../../store/use-auth-store';

export function useGetAllPedidosWithPagination(limit) {
  const { token } = useAuthStore();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPedidos, setTotalPedidos] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const offset = (currentPage - 1) * limit; // Calcula el offset
        const response = await getAllPedidosService(token, limit, offset);
        if (isMounted) {
          setPedidos(response.pedidos);
          setTotalPedidos(response.total); // Cambia a `response.total` si la API devuelve `total`
        }
      } catch (error) {
        console.log(error);
        setError('Error al obtener todos los pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [limit, currentPage, token]);

  const totalPages = Math.ceil(totalPedidos / limit);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return {
    pedidos,
    loading,
    error,
    currentPage,
    nextPage,
    prevPage,
    totalPages,
  };
}
