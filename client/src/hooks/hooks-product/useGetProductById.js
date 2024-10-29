import { useEffect, useState } from 'react';
import { getProductByIdService } from '../../services/products-services/getById-product';

export function useGetProductById(producto_id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductByIdService(producto_id);

        setProduct(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [producto_id]); // Dependencia

  return { product, loading, error };
}
