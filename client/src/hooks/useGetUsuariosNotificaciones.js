import { useState, useEffect } from "react";
import { getUsuariosNotificaciones } from "../services/getUsuariosNotificaciones";
import useNotificacionStore from "../store/useNotification";

const useGetUsuariosNotificaciones = () => {
  const { usuarioNotificaciones, setUsuarioNotificaciones } = useNotificacionStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPedidosNotificacion = async () => {
      setUsuarioNotificaciones([])
      try {
        const response = await getUsuariosNotificaciones()
        setUsuarioNotificaciones(response)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchPedidosNotificacion()
  }, [])

  return {
    data: usuarioNotificaciones,
    loading,
    error
  }
}

export default useGetUsuariosNotificaciones