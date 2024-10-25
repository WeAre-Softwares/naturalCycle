import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      carrito: [],

      // Agregar producto al carrito
      addToCart: (producto) => {
        const existingProduct = get().carrito.find(
          (p) => p.producto_id === producto.producto_id,
        );

        if (existingProduct) {
          // Si el producto ya está en el carrito, aumentamos su cantidad
          set({
            carrito: get().carrito.map((p) =>
              p.producto_id === producto.producto_id
                ? { ...p, cantidad: p.cantidad + 1 }
                : p,
            ),
          });
        } else {
          // Si no está, lo agregamos al carrito con la estructura completa
          set({
            carrito: [...get().carrito, { ...producto, cantidad: 1 }],
          });
        }
      },

      // Remover producto del carrito
      removeFromCart: (productId) => {
        set({
          carrito: get().carrito.filter(
            (producto) => producto.producto_id !== productId,
          ),
        });
      },

      // Actualizar cantidad de un producto específico
      updateQuantity: (productId, cantidad) => {
        set({
          carrito: get().carrito.map((producto) =>
            producto.producto_id === productId
              ? { ...producto, cantidad }
              : producto,
          ),
        });
      },

      // Funciones para incrementar o disminuir la cantidad
      //TODO: Chequear capacidad Máxima
      incrementQuantity: (productId, max = 500) => {
        const producto = get().carrito.find((p) => p.producto_id === productId);
        if (producto && producto.cantidad < max) {
          set({
            carrito: get().carrito.map((p) =>
              p.producto_id === productId
                ? { ...p, cantidad: p.cantidad + 1 }
                : p,
            ),
          });
        }
      },

      decrementQuantity: (productId, min = 1) => {
        const producto = get().carrito.find((p) => p.producto_id === productId);
        if (producto && producto.cantidad > min) {
          set({
            carrito: get().carrito.map((p) =>
              p.producto_id === productId
                ? { ...p, cantidad: p.cantidad - 1 }
                : p,
            ),
          });
        }
      },

      // Vaciar carrito
      clearCart: () => set({ carrito: [] }),

      // Total de productos en el carrito
      getTotalProducts: () => {
        return get().carrito.reduce(
          (total, producto) => total + producto.cantidad,
          0,
        );
      },

      // Calcular precio total del carrito
      getTotalPrice: () => {
        return get().carrito.reduce(
          (total, producto) => total + producto.precio * producto.cantidad,
          0,
        );
      },
    }),
    {
      name: 'cart', // nombre del storage
      getStorage: () => localStorage, // persistencia en localStorage
    },
  ),
);

export default useCartStore;
