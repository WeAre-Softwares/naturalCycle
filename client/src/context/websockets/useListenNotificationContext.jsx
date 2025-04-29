import { useContext } from "react";
import { ListenNotificationsContext } from "./listenNotificationsContext";

const useListenNotification = () => {
  const context = useContext(ListenNotificationsContext)

  if (!context) throw new Error('useListenNotification debe estar dentro del proveedor de ListenNotificationProvider')

  return context
}

export default useListenNotification