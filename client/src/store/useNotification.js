import { create } from "zustand";

const useNotificacionStore = create((set) => ({
  notificaciones: [],
  setNotificaciones: (notificaciones) => set({ notificaciones }),

  pedidoNotificaciones: [],
  setPedidoNotificaciones: (pedidoNotificaciones) => set({ pedidoNotificaciones }),

  usuarioNotificaciones: [],
  setUsuarioNotificaciones: (usuarioNotificaciones) => set({ usuarioNotificaciones }),

  removePedidoNotificaciones: () => set({ pedidoNotificaciones: [] }),

  removeUsuarioNotificaciones: () => set({ usuarioNotificaciones: [] }),
}))

export default useNotificacionStore