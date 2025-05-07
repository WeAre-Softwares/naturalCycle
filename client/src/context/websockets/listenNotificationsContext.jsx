import { createContext, useEffect } from "react";
import useNotificacionStore from "../../store/useNotification";
import { io } from "socket.io-client";
import useAuthStore from "../../store/use-auth-store";
import { API_URL_SOCKET } from "../../constants/api-url.contant";

const ListenNotificationsContext = createContext()

const ListenNotificationProvider = ({ children }) => {
  const {pedidoNotificaciones, setPedidoNotificaciones, usuarioNotificaciones, setUsuarioNotificaciones, setNotificaciones, notificaciones} = useNotificacionStore()
  const { isAuthenticated, getRoles } = useAuthStore()

  const hasAccess =
  isAuthenticated() &&
  (getRoles().includes('admin') || getRoles().includes('empleado'));

  useEffect(() => {
    if (!hasAccess) return

    const socket = io(API_URL_SOCKET)

    socket.on('nuevaNotificacion', (data) => {
      if (data.tipo === 'pedido') setPedidoNotificaciones([...pedidoNotificaciones, data])
      if (data.tipo === 'usuario') setUsuarioNotificaciones([...usuarioNotificaciones, data])
      setNotificaciones([...notificaciones, data])
    })

    return () => {
      socket.off('nuevaNotificacion')
      socket.disconnect()
    }
  }, [pedidoNotificaciones, setPedidoNotificaciones, usuarioNotificaciones, setUsuarioNotificaciones, setNotificaciones, notificaciones, hasAccess])

  return (
    <ListenNotificationsContext.Provider value={{}}>

      {children}
    </ListenNotificationsContext.Provider>
  )
}

export {
  ListenNotificationsContext,
  ListenNotificationProvider
}