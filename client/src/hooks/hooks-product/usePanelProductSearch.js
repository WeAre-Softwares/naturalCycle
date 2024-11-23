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

  const {
    productsData: allProductsData,
    loading: loadingAllProducts,
    error: errorAllProducts,
    refetch: refetchActiveProducts,
  } = useGetAllProducts(limit, offset);

  const {
    productsData: searchProductsData,
    loading: loadingSearch,
    error: errorSearch,
  } = useSearchProducts(debouncedSearchTerm, limit, offset);

  const [inactiveProductsData, setInactiveProductsData] = useState([]);
  const [loadingInactive, setLoadingInactive] = useState(false);
  const [errorInactive, setErrorInactive] = useState(null);
  const [totalInactive, setTotalInactive] = useState(0);

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
      setErrorInactive('Error al cargar productos inactivos');
    } finally {
      setLoadingInactive(false);
    }
  };

  const [noStockProductsData, setNoStockProductsData] = useState([]);
  const [loadingNoStock, setLoadingNoStock] = useState(false);
  const [errorNoStock, setErrorNoStock] = useState(null);
  const [totalNoStock, setTotalNoStock] = useState(0);

  const loadNoStockProducts = async () => {
    setLoadingNoStock(true);
    try {
      const { productos, total } = await getAllProductsSinStock(limit, offset);
      setNoStockProductsData(productos);
      setTotalNoStock(total);
    } catch (error) {
      setErrorNoStock('Error al cargar productos sin stock');
    } finally {
      setLoadingNoStock(false);
    }
  };

  useEffect(() => {
    if (showInactive) {
      loadInactiveProducts();
    } else if (showNoStock) {
      loadNoStockProducts();
    } else if (debouncedSearchTerm) {
      refetchActiveProducts();
    }
  }, [showInactive, showNoStock, debouncedSearchTerm, offset]);

  // Reinicia la paginación cuando cambia el término de búsqueda
  useEffect(() => {
    setOffset(0);
  }, [debouncedSearchTerm]);

  const getCurrentState = () => {
    if (showInactive) {
      return {
        productsData: inactiveProductsData,
        loading: loadingInactive,
        error: errorInactive,
        total: totalInactive,
      };
    }
    if (showNoStock) {
      return {
        productsData: noStockProductsData,
        loading: loadingNoStock,
        error: errorNoStock,
        total: totalNoStock,
      };
    }
    if (debouncedSearchTerm) {
      return {
        productsData: searchProductsData?.productos,
        loading: loadingSearch,
        error: errorSearch,
        total: searchProductsData?.total || 0,
      };
    }
    return {
      productsData: allProductsData?.productos,
      loading: loadingAllProducts,
      error: errorAllProducts,
      total: allProductsData?.total || 0,
    };
  };

  const { productsData, loading, error, total } = getCurrentState();

  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;
  const currentPage = Math.floor(offset / limit) + 1;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setOffset((prevOffset) => prevOffset + limit);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setOffset((prevOffset) => prevOffset - limit);
    }
  };

  const toggleInactiveFilter = () => {
    setShowInactive((prev) => !prev);
    setShowNoStock(false);
    setOffset(0);
  };

  const toggleNoStockFilter = () => {
    setShowNoStock((prev) => !prev);
    setShowInactive(false);
    setOffset(0);
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
    showNoStock,
    toggleNoStockFilter,
  };
};
