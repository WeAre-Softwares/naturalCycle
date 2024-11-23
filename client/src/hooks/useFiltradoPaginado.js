import { useState, useEffect } from 'react';
import { searchMarcasService } from '../services/marca-services/search-marcas';
import { searchEtiquetasService } from '../services/etiquetas-service/search-etiquetas';
import { searchCategoriesService } from '../services/categoria-services/search-categories';
import { getAllMarcasService } from '../services/marca-services/getAll-marcas';
import { getAllEtiquetasService } from '../services/etiquetas-service/getAll-etiquetas';
import { getAllCategoriesService } from '../services/categoria-services/getAll-categories';
import { getInactiveBrandsService } from '../services/marca-services/getInactiveBrands';
import { getInactiveEtiquetasService } from '../services/etiquetas-service/getInactiveEtiquetas';
import { getInactiveCategoriesService } from '../services/categoria-services/getInactiveCategories';
import useAuthStore from '../store/use-auth-store';

export const useFiltradoPaginado = (
  tipo,
  searchTerm,
  itemsPerPage = 5,
  isInactive = false,
) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Extrear el JWT del localStorage usando el estado global
  const { token } = useAuthStore();

  useEffect(() => {
    setCurrentPage(1); // Resetea cuando cambia el tipo o estado de inactivo
  }, [tipo, isInactive]);

  useEffect(() => {
    // Resetea a la página 1 cuando cambia el término de búsqueda
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const offset = (currentPage - 1) * itemsPerPage;
      let response;

      try {
        // Lógica para manejar casos activos e inactivos por separado
        if (!isInactive && searchTerm) {
          // Búsqueda solo si `isInactive` es false
          response =
            tipo === 'marca'
              ? await searchMarcasService(searchTerm, itemsPerPage, offset)
              : tipo === 'etiqueta'
              ? await searchEtiquetasService(searchTerm, itemsPerPage, offset)
              : await searchCategoriesService(searchTerm, itemsPerPage, offset);
        } else {
          // Llamadas sin `searchTerm` cuando `isInactive` es true o no hay búsqueda
          response =
            tipo === 'marca'
              ? isInactive
                ? await getInactiveBrandsService(itemsPerPage, offset, token)
                : await getAllMarcasService(itemsPerPage, offset)
              : tipo === 'etiqueta'
              ? isInactive
                ? await getInactiveEtiquetasService(itemsPerPage, offset, token)
                : await getAllEtiquetasService(itemsPerPage, offset)
              : isInactive
              ? await getInactiveCategoriesService(itemsPerPage, offset, token)
              : await getAllCategoriesService(itemsPerPage, offset);
        }

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
  }, [tipo, searchTerm, currentPage, itemsPerPage, isInactive]);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  return { data, currentPage, totalItems, isLoading, itemsPerPage, goToPage };
};
