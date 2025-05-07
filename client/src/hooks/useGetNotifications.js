import { useState, useEffect } from "react";
import { getNotifications } from "../services/getNotifications";
import useNotificacionStore from "../store/useNotification";

const useGetNotifications = (hasAccess) => {
  const { notificaciones, setNotificaciones } = useNotificacionStore()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!hasAccess) return

    const fetchNotifications = async () => {
      try {
        const response = await getNotifications()
        setNotificaciones(response)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [hasAccess])

  return {
    data: notificaciones,
    loading,
    error
  }
}

export default useGetNotifications