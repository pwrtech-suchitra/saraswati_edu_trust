import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function Alert({
  type = 'info',
  title,
  children,
  onClose,
  className = '',
}) {
  const iconMap = {
    success: <CheckCircle2 size={20} color="#16a34a" />,
    warning: <AlertTriangle size={20} color="#d97706" />,
    error: <AlertCircle size={20} color="#dc2626" />,
    info: <Info size={20} color="#0284c7" />,
  };

  return (
    <div className={`alert alert-${type} ${className}`.trim()} role="alert">
      <div style={{ flexShrink: 0, marginTop: '0.1rem' }}>{iconMap[type]}</div>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{title}</div>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '0.1rem',
            opacity: 0.7,
          }}
          aria-label="Close alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
