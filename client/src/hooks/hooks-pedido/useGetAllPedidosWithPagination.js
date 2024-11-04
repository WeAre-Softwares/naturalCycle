import { useEffect, useState } from 'react';

import useAuthStore from '../../store/use-auth-store';
import { getPedidosFiltrados } from '../../services/pedidos-service/get-pedidos-filtrados';
import { getAllPedidosService } from '../../services/pedidos-service/getAll-pedidos';

export function useGetAllPedidosWithPagination(limit, estadoFiltro = '') {
  const { token } = useAuthStore();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPedidos, setTotalPedidos] = useState(0);

  useEffect(() => {
    setCurrentPage(1); // Resetea la paginación al cambiar el filtro
  }, [estadoFiltro]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const offset = (currentPage - 1) * limit;

        // Usa el servicio adecuado dependiendo de si hay un filtro de estado
        const response = estadoFiltro
          ? await getPedidosFiltrados(token, estadoFiltro, limit, offset)
          : await getAllPedidosService(token, limit, offset);

        if (isMounted) {
          setPedidos(response.pedidos);
          setTotalPedidos(response.total);
        }
      } catch (error) {
        console.error(error);
        setError('Error al obtener los pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [limit, currentPage, estadoFiltro, token]);

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
