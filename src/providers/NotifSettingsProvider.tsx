import React, { createContext, useContext } from 'react';
import { useNotificationSettings } from '../hooks/useNotificationSettings';

type NotifSettingsContextType = ReturnType<typeof useNotificationSettings>;

const NotifSettingsContext = createContext<NotifSettingsContextType | null>(null);

export function NotifSettingsProvider({ children }: { children: React.ReactNode }) {
  const value = useNotificationSettings();
  return (
    <NotifSettingsContext.Provider value={value}>
      {children}
    </NotifSettingsContext.Provider>
  );
}

export function useNotifSettingsContext(): NotifSettingsContextType {
  const ctx = useContext(NotifSettingsContext);
  if (!ctx) throw new Error('useNotifSettingsContext must be used within NotifSettingsProvider');
  return ctx;
}
