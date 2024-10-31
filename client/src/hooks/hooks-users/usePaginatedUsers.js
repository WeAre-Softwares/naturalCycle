import { useState, useEffect } from 'react';
import useAuthStore from '../../store/use-auth-store';
import { getInactiveUsers } from '../../services/users-services/getInactiveUsers';
import { getAllUsersService } from '../../services/users-services/getAll-users';
import { searchUsersService } from '../../services/users-services/search-users';

export const usePaginatedUsers = (
  searchTerm = '',
  itemsPerPage = 5,
  isInactive = false,
) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    setCurrentPage(1); // Resetea la página cuando cambian los filtros
  }, [searchTerm, isInactive]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const offset = (currentPage - 1) * itemsPerPage;
      let response;

      try {
        if (searchTerm) {
          // Búsqueda de usuarios
          response = await searchUsersService(
            searchTerm,
            itemsPerPage,
            offset,
            token,
          );
        } else if (isInactive) {
          // Obtener usuarios inactivos
          response = await getInactiveUsers(itemsPerPage, offset, token);
        } else {
          // Obtener usuarios activos
          response = await getAllUsersService(itemsPerPage, offset, token);
        }

        setData(response.usuarios || []);
        setTotalItems(response.total || 0);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, currentPage, itemsPerPage, isInactive, token]);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  return { data, currentPage, totalItems, isLoading, itemsPerPage, goToPage };
};
