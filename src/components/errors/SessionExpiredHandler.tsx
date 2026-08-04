import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UNAUTHORIZED_EVENT = 'crewpal:unauthorized';

export const SessionExpiredHandler = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const handleUnauthorized = (): void => {
      logout();
    };

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [logout]);

  return null;
};
