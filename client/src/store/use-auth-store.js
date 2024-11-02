import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      exp: null, // Guardamos la fecha de expiración del token directamente

      // Acción para iniciar sesión
      login: (token) => {
        const decodedToken = jwtDecode(token);
        const { sub, email, roles, exp } = decodedToken; // Extraemos los campos necesarios; `sub` es el campo de ID de usuario

        const user = { email, roles };
        set({ id: sub, token, user, exp }); // Guardamos el estado global con token, user y exp. Guardamos el ID en `user`
      },

      // Acción para cerrar sesión
      logout: () => set({ token: null, user: null, exp: null }),

      // Verificar si el token está expirado
      isTokenExpired: () => {
        const exp = get().exp;
        if (!exp) return true;
        return new Date().getTime() / 1000 > exp; // Comparar contra el tiempo actual en segundos
      },

      // Verificar si el usuario está autenticado
      isAuthenticated: () => {
        const token = get().token;
        return token && !get().isTokenExpired();
      },

      // Verificar roles user
      getRoles: () => {
        const token = get().token;
        if (!token) return [];
        const { roles } = jwtDecode(token);
        return roles || [];
      },
    }),
    {
      name: 'auth', // nombre del storage
      getStorage: () => localStorage,
    },
  ),
);

export default useAuthStore;
