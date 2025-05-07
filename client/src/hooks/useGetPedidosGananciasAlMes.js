import { useState, useEffect } from "react";
import useAuthStore from "../store/use-auth-store";
import { useGetPedidosGananciasPorMes } from "../services/getPedidosGananciaPorMes";
import useNotificacionStore from "../store/useNotification";

const useGetPedidosGananciasAlMes = () => {
  const {pedidoNotificaciones} = useNotificacionStore()
  const [pedidosGanancias, setPedidosGanancias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchPedidosGanancias = async () => {
      try {
        const response = await useGetPedidosGananciasPorMes(token)

        const labels = response.map(item => item.semana);
        const values = response.map(item => item.ganancia);

        setPedidosGanancias({ labels, data: values });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchPedidosGanancias();
    } else {
      setLoading(false);
      setError("Token is missing");
    }
  }, [token, pedidoNotificaciones]);


  return { pedidosGanancias, loading, error };
}

export default useGetPedidosGananciasAlMes;