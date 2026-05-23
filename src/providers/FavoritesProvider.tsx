import React, { createContext, useContext } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { useAuth } from './AuthProvider';

type FavoritesContextType = ReturnType<typeof useFavorites>;

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const value = useFavorites(user?.id ?? null);
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext(): FavoritesContextType {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavoritesContext must be used within FavoritesProvider');
  return ctx;
}
