import { useState, useEffect } from "react";
import useAuthStore from "../store/use-auth-store";
import { getCategoriasMasVendidasPorProducto } from "../services/getCategoriasMasVendidasPorProducto";
import useNotificacionStore from "../store/useNotification";

const useGetCategoriasMasVendidasPorProducto = (rango) => {
  const {pedidoNotificaciones} = useNotificacionStore()
  const [categoriasMasVendidasPorProducto, setCategoriasMasVendidasPorProducto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchCategoriasMasVendidasPorProducto = async () => {
      try {
        const response = await getCategoriasMasVendidasPorProducto(token, rango)
        setCategoriasMasVendidasPorProducto(response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchCategoriasMasVendidasPorProducto();
    } else {
      setLoading(false);
      setError("Token is missing");
    }
  }, [token, rango, pedidoNotificaciones]);

  return { categoriasMasVendidasPorProducto, loading, error };
}

export default useGetCategoriasMasVendidasPorProducto;