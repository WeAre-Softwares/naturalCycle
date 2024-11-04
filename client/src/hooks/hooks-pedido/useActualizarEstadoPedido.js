import { useState } from 'react';
import { actualizarEstadoPedido } from '../../services/pedidos-service/actualizar-estado-pedido';
import useAuthStore from '../../store/use-auth-store';

export const useActualizarEstadoPedido = () => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cambiarEstadoPedido = async (id, nuevoEstado) => {
    setLoading(true);
    setError(null);

    try {
      const updatedPedido = await actualizarEstadoPedido(
        token,
        id,
        nuevoEstado,
      );
      return updatedPedido;
    } catch (err) {
      setError('Error al cambiar el estado del pedido');
    } finally {
      setLoading(false);
    }
  };

  return {
    cambiarEstadoPedido,
    loading,
    error,
  };
};
