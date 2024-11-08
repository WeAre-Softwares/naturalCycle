import { useState, useEffect } from 'react';
import { getUserByIdService } from '../../services/users-services/getById-user';
import useAuthStore from '../../store/use-auth-store';

export const useGetUserById = () => {
  const { token } = useAuthStore();
  const userId = useAuthStore((state) => state.getUserId()); // Obtiene el ID del usuario desde el store
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const userData = await getUserByIdService(token, userId);
        setUser(userData);
      } catch (err) {
        console.error('Error in useGetUserById:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [token, userId]);

  return { user, loading, error };
};
