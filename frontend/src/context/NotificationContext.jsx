import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const showSuccess = useCallback((message) => addToast(message, 'success'), [addToast]);
  const showError = useCallback((message) => addToast(message, 'error', 5500), [addToast]);
  const showInfo = useCallback((message) => addToast(message, 'info'), [addToast]);
  const showWarning = useCallback((message) => addToast(message, 'warning'), [addToast]);

  return (
    <NotificationContext.Provider
      value={{
        showSuccess,
        showError,
        showInfo,
        showWarning,
      }}
    >
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="toast"
            style={{
              borderLeft:
                toast.type === 'success'
                  ? '4px solid #22c55e'
                  : toast.type === 'error'
                  ? '4px solid #ef4444'
                  : toast.type === 'warning'
                  ? '4px solid #f59e0b'
                  : '4px solid #3b82f6',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {toast.type === 'success' && <CheckCircle2 size={18} color="#22c55e" />}
              {toast.type === 'error' && <AlertCircle size={18} color="#ef4444" />}
              {toast.type === 'warning' && <AlertCircle size={18} color="#f59e0b" />}
              {toast.type === 'info' && <Info size={18} color="#3b82f6" />}
              <span style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '0.2rem',
                display: 'flex',
              }}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
