import React, { createContext, useContext } from 'react';
import { useMatches } from '../hooks/useMatches';

type MatchesContextType = ReturnType<typeof useMatches>;

const MatchesContext = createContext<MatchesContextType | null>(null);

export function MatchesProvider({ children }: { children: React.ReactNode }) {
  const value = useMatches();
  return (
    <MatchesContext.Provider value={value}>
      {children}
    </MatchesContext.Provider>
  );
}

export function useMatchesContext(): MatchesContextType {
  const ctx = useContext(MatchesContext);
  if (!ctx) throw new Error('useMatchesContext must be used within MatchesProvider');
  return ctx;
}
