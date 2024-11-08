import { useState, useEffect } from 'react';
import { getDetallePedidoByIdService } from '../../services/detalles-pedidos-service/get-detalle-pedido-by-id';
import useAuthStore from '../../store/use-auth-store';

export const useGetDetallePedidoById = (pedidoId) => {
  const { token } = useAuthStore();
  const [detallePedido, setDetallePedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetallePedido = async () => {
      setLoading(true);
      setError(null);

      try {
        const detalleData = await getDetallePedidoByIdService(token, pedidoId);
        setDetallePedido(detalleData);
      } catch (err) {
        console.error('Error in useGetDetallePedidoById:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (pedidoId) fetchDetallePedido();
  }, [token, pedidoId]);

  return { detallePedido, loading, error };
};
