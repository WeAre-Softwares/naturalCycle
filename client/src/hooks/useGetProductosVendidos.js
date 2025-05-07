import { useState, useEffect } from "react";
import useAuthStore from "../store/use-auth-store";
import { getProductosVendidos } from "../services/getProductosVendidos";
import useNotificacionStore from "../store/useNotification";

const useGetProductosVendidos = (range) => {
  const {pedidoNotificaciones} = useNotificacionStore()
  const [productosVendidos, setProductosVendidos] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchPedidosGanancias = async () => {
      try {
        const response = await getProductosVendidos(token, range)
        setProductosVendidos(response);
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
  }, [token, range, pedidoNotificaciones]);


  return { productosVendidos, loading, error };
}

export default useGetProductosVendidos;