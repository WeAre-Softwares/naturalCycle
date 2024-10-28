import { useState } from 'react';
import { useGetAllProducts } from './useGetAllProducts';
import { useSearchProducts } from './useSearchProducts';
import { useDebouncedValue } from './useDebouncedValue';

export const useProductSearch = (limit) => {
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 600);

  const {
    productsData: allProductsData,
    loading: loadingAllProducts,
    error: errorAllProducts,
  } = useGetAllProducts(limit, offset);

  const {
    productsData: searchProductsData,
    loading: loadingSearch,
    error: errorSearch,
  } = useSearchProducts(debouncedSearchTerm, limit, offset);

  const productsData = debouncedSearchTerm
    ? searchProductsData?.productos
    : allProductsData?.productos;

  const loading = debouncedSearchTerm ? loadingSearch : loadingAllProducts;
  const error = debouncedSearchTerm ? errorSearch : errorAllProducts;
  const total = debouncedSearchTerm
    ? searchProductsData?.total || 0
    : allProductsData?.total || 0;
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
  };
};
