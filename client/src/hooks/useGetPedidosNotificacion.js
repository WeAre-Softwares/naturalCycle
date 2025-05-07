import { useState, useEffect } from "react";
import useNotificacionStore from "../store/useNotification";
import { getPedidosNotificacion } from "../services/getPedidosNotificacion";

const useGetPedidosNotificaciones = () => {
  const { pedidoNotificaciones, setPedidoNotificaciones } = useNotificacionStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPedidosNotificacion = async () => {
      setPedidoNotificaciones([])
      try {
        const response = await getPedidosNotificacion()
        setPedidoNotificaciones(response)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchPedidosNotificacion()
  }, [])

  return {
    data: pedidoNotificaciones,
    loading,
    error
  }
}

export default useGetPedidosNotificaciones