import { useState, useEffect } from 'react';
import { searchMarcasService } from '../services/marca-services/search-marcas';
import { searchEtiquetasService } from '../services/etiquetas-service/search-etiquetas';
import { searchCategoriesService } from '../services/categoria-services/search-categories';
import { getAllMarcasService } from '../services/marca-services/getAll-marcas';
import { getAllEtiquetasService } from '../services/etiquetas-service/getAll-etiquetas';
import { getAllCategoriesService } from '../services/categoria-services/getAll-categories';

export const useFiltradoPaginado = (tipo, searchTerm, itemsPerPage = 5) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Mantener la página actual aquí
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Resetea la página cuando cambia el tipo de filtrado
  useEffect(() => {
    setCurrentPage(1); // Resetear a la primera página
  }, [tipo]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const offset = (currentPage - 1) * itemsPerPage;
      let response;

      try {
        if (searchTerm) {
          // Llamadas de búsqueda según el tipo
          response =
            tipo === 'marca'
              ? await searchMarcasService(searchTerm, itemsPerPage, offset)
              : tipo === 'etiqueta'
              ? await searchEtiquetasService(searchTerm, itemsPerPage, offset)
              : await searchCategoriesService(searchTerm, itemsPerPage, offset);
        } else {
          // Llamadas generales según el tipo
          response =
            tipo === 'marca'
              ? await getAllMarcasService(itemsPerPage, offset)
              : tipo === 'etiqueta'
              ? await getAllEtiquetasService(itemsPerPage, offset)
              : await getAllCategoriesService(itemsPerPage, offset);
        }

        // Clave de los datos para cada tipo
        const itemsKey =
          tipo === 'marca'
            ? 'marcas'
            : tipo === 'etiqueta'
            ? 'etiquetas'
            : 'categorias';
        setData(response[itemsKey]);
        setTotalItems(response.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tipo, searchTerm, currentPage, itemsPerPage]);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return {
    data,
    currentPage,
    totalItems,
    isLoading,
    itemsPerPage,
    goToPage,
  };
};
