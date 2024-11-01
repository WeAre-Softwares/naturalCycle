import { useState, useEffect } from 'react';
import { useGetAllProducts } from './useGetAllProducts';
import { useSearchProducts } from './useSearchProducts';
import { getInactiveProductsService } from '../../services/products-services/getInactiveProducts';
import { useDebouncedValue } from '../useDebouncedValue';
import useAuthStore from '../../store/use-auth-store';

export const useProductSearch = (limit) => {
  const [offsetActive, setOffsetActive] = useState(0);
  const [offsetInactive, setOffsetInactive] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 600);

  const { token } = useAuthStore();

  // Obtener productos activos
  const {
    productsData: allProductsData,
    loading: loadingAllProducts,
    error: errorAllProducts,
    refetch: refetchActiveProducts,
  } = useGetAllProducts(limit, offsetActive);

  // Obtener productos según la búsqueda
  const {
    productsData: searchProductsData,
    loading: loadingSearch,
    error: errorSearch,
  } = useSearchProducts(debouncedSearchTerm, limit, offsetActive);

  const [inactiveProductsData, setInactiveProductsData] = useState([]);
  const [loadingInactive, setLoadingInactive] = useState(false);
  const [errorInactive, setErrorInactive] = useState(null);
  const [totalInactive, setTotalInactive] = useState(0);

  // Cargar productos inactivos
  const loadInactiveProducts = async () => {
    setLoadingInactive(true);
    try {
      const { productos, total } = await getInactiveProductsService(
        limit,
        offsetInactive,
        token,
      );
      setInactiveProductsData(productos);
      setTotalInactive(total);
    } catch (error) {
      setErrorInactive(error);
    } finally {
      setLoadingInactive(false);
    }
  };

  // Cargar productos inactivos al activar el filtro
  useEffect(() => {
    if (showInactive) {
      loadInactiveProducts();
    }
  }, [showInactive, offsetInactive]);

  // Determinar los datos y el estado de carga de productos según el filtro
  const productsData = showInactive
    ? inactiveProductsData
    : debouncedSearchTerm
    ? searchProductsData?.productos
    : allProductsData?.productos;

  const loading = showInactive
    ? loadingInactive
    : debouncedSearchTerm
    ? loadingSearch
    : loadingAllProducts;

  const error = showInactive
    ? errorInactive
    : debouncedSearchTerm
    ? errorSearch
    : errorAllProducts;

  const total = showInactive
    ? totalInactive
    : debouncedSearchTerm
    ? searchProductsData?.total || 0
    : allProductsData?.total || 0;

  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;
  const currentPage =
    Math.floor((showInactive ? offsetInactive : offsetActive) / limit) + 1;

  // Funciones de paginación independientes
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      if (showInactive) {
        setOffsetInactive((prevOffset) => prevOffset + limit);
      } else {
        setOffsetActive((prevOffset) => prevOffset + limit);
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      if (showInactive) {
        setOffsetInactive((prevOffset) => prevOffset - limit);
      } else {
        setOffsetActive((prevOffset) => prevOffset - limit);
      }
    }
  };

  const toggleInactiveFilter = () => {
    setShowInactive((prev) => !prev);
  };

  return {
    productsData,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    handleNextPage,
    handlePrevPage,
    showInactive,
    toggleInactiveFilter,
  };
};
