import { useCallback } from 'react';
import { getPedidoRemitoService } from '../../services/remitos-services/get-remito';
import useAuthStore from '../../store/use-auth-store';

export const useDownloadRemito = () => {
  const { token } = useAuthStore();
  return useCallback(
    async (pedidoId) => {
      await getPedidoRemitoService(pedidoId, token);
    },
    [token],
  );
};
