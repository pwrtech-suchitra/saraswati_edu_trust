import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContextValue';

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
