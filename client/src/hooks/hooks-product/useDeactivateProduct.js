import { useState } from 'react';
import { toast } from 'react-toastify';
import { deactivateProductService } from '../../services/products-services/deactivate-product';
import useAuthStore from '../../store/use-auth-store';

export const useDeactivateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Extrear el JWT del localStorage usando el estado global
  const { token } = useAuthStore();

  const deactivateProduct = async (producto_id) => {
    setIsLoading(true);
    try {
      const response = await deactivateProductService(producto_id, token);
      toast.success(response.mensaje || 'Producto desactivado con éxito');
      return true;
    } catch (error) {
      toast.error(error.message || 'Error al desactivar el producto');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { deactivateProduct, isLoading };
};
