import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cantidadSchema } from '../schemas/cantidad-carrito-schema';
import { toast } from 'react-toastify';

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
          // Si no está, lo agregamos al carrito con la estructura completa y agregamos una notificación en la UI
          set({
            carrito: [...get().carrito, { ...producto, cantidad: 1 }],
          });
          toast.success('Producto agregado al carrito!', {
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'dark',
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
      updateQuantity: async (productId, cantidad) => {
        try {
          await cantidadSchema.validate(cantidad);
          set({
            carrito: get().carrito.map((producto) =>
              producto.producto_id === productId
                ? { ...producto, cantidad }
                : producto,
            ),
          });
        } catch (error) {
          console.error(error.message);
        }
      },

      incrementQuantity: (productId) => {
        set((state) => {
          const producto = state.carrito.find(
            (p) => p.producto_id === productId,
          );

          // Verificar si la cantidad es menor a 1000 antes de incrementar
          if (producto && producto.cantidad < 1000) {
            return {
              carrito: state.carrito.map((p) =>
                p.producto_id === productId
                  ? { ...p, cantidad: p.cantidad + 1 }
                  : p,
              ),
            };
          }
          return state; // Si la cantidad es 1000 o más, no hacer cambios
        });
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
