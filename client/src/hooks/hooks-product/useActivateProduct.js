import { useState } from 'react';

import { toast } from 'react-toastify';
import { activateProductService } from '../../services/products-services/activate-product';
import useAuthStore from '../../store/use-auth-store';

export const useActivateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthStore();

  const activateProduct = async (producto_id) => {
    setIsLoading(true);
    try {
      const response = await activateProductService(producto_id, token);

      toast.success(response.mensaje || 'Producto activado con éxito');

      return true;
    } catch (error) {
      toast.error(error.message || 'Error al activar el producto');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { activateProduct, isLoading };
};
