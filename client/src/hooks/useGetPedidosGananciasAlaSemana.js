import { useState, useEffect } from "react";
import useAuthStore from "../store/use-auth-store";
import { useGetPedidosGananciasPorSemana } from "../services/getPedidosGananciasPorSemana";
import useNotificacionStore from "../store/useNotification";

const useGetPedidosGananciasAlaSemana = () => {
  const {pedidoNotificaciones} = useNotificacionStore()
  const [pedidosGanancias, setPedidosGanancias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchPedidosGanancias = async () => {
      try {
        const response = await useGetPedidosGananciasPorSemana(token)
        setPedidosGanancias(response);
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

export default useGetPedidosGananciasAlaSemana;