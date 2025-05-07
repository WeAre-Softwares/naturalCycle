import { useState, useEffect } from "react";
import useAuthStore from "../store/use-auth-store";
import { getCategoriasMasVendidas } from "../services/getCategoriasMasVendidas";
import useNotificacionStore from "../store/useNotification";

const useGetCategoriasMasVendidas = (rango) => {
  const {pedidoNotificaciones} = useNotificacionStore()
  const [categoriasMasVendidas, setCategoriasMasVendidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchCategoriasMasVendidas = async () => {
      try {
        const response = await getCategoriasMasVendidas(token, rango)
        setCategoriasMasVendidas(response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchCategoriasMasVendidas();
    } else {
      setLoading(false);
      setError("Token is missing");
    }
  }, [token, rango, pedidoNotificaciones]);


  return { categoriasMasVendidas, loading, error };
}

export default useGetCategoriasMasVendidas;