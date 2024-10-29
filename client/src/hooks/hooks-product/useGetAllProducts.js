import { useEffect, useState } from 'react';
import { getAllProductsService } from '../../services/products-services/getAll-products';

export function useGetAllProducts(limit, offset) {
  const [productsData, setProductsData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllProductsService(limit, offset);
        // console.log(data);
        setProductsData(data);
      } catch (error) {
        console.log(error);
        setError('Error al obtener todos los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit, offset]); // Dependencias

  return { productsData, loading, error };
}
