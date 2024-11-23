import { useState, useEffect } from 'react';
import { useGetAllProducts } from './useGetAllProducts';
import { useSearchProducts } from './useSearchProducts';
import { getInactiveProductsService } from '../../services/products-services/getInactiveProducts';
import { getAllProductsSinStock } from '../../services/products-services/getAll-productsSinStock';
import { useDebouncedValue } from '../useDebouncedValue';
import useAuthStore from '../../store/use-auth-store';

export const useProductSearch = (limit) => {
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [showNoStock, setShowNoStock] = useState(false);
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 600);

  const { token } = useAuthStore();

  // Obtener productos activos
  const {
    productsData: allProductsData,
    loading: loadingAllProducts,
    error: errorAllProducts,
    refetch: refetchActiveProducts,
  } = useGetAllProducts(limit, offset);

  // Obtener productos según la búsqueda
  const {
    productsData: searchProductsData,
    loading: loadingSearch,
    error: errorSearch,
  } = useSearchProducts(debouncedSearchTerm, limit, offset);

  // Productos inactivos
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
        offset,
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

  // Productos sin stock
  const [noStockProductsData, setNoStockProductsData] = useState([]);
  const [loadingNoStock, setLoadingNoStock] = useState(false);
  const [errorNoStock, setErrorNoStock] = useState(null);
  const [totalNoStock, setTotalNoStock] = useState(0);

  const loadNoStockProducts = async () => {
    setLoadingNoStock(true);
    try {
      const offsetValue = offset || 0;
      const { productos, total } = await getAllProductsSinStock(
        limit,
        offsetValue,
      );
      setNoStockProductsData(productos);
      setTotalNoStock(total);
    } catch (error) {
      setErrorNoStock(error);
    } finally {
      setLoadingNoStock(false);
    }
  };

  // Cargar inactivos o sin stock según el filtro activado
  useEffect(() => {
    if (showInactive) {
      loadInactiveProducts();
    } else if (showNoStock) {
      loadNoStockProducts();
    }
  }, [showInactive, showNoStock, offset]);

  // Determinar datos y estado según el filtro
  const productsData = showInactive
    ? inactiveProductsData
    : showNoStock
    ? noStockProductsData
    : debouncedSearchTerm
    ? searchProductsData?.productos
    : allProductsData?.productos;

  const loading = showInactive
    ? loadingInactive
    : showNoStock
    ? loadingNoStock
    : debouncedSearchTerm
    ? loadingSearch
    : loadingAllProducts;

  const error = showInactive
    ? errorInactive
    : showNoStock
    ? errorNoStock
    : debouncedSearchTerm
    ? errorSearch
    : errorAllProducts;

  const total = showInactive
    ? totalInactive
    : showNoStock
    ? totalNoStock
    : debouncedSearchTerm
    ? searchProductsData?.total || 0
    : allProductsData?.total || 0;

  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;
  const currentPage = Math.floor(offset / limit) + 1;

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
    setShowInactive,
    showNoStock,
    setShowNoStock,
  };
};
