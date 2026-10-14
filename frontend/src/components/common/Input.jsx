import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';

export default function Input({
  label,
  id,
  type = 'text',
  error,
  helperText,
  required = false,
  className = '',
  icon: Icon = null,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || props.name || generatedId;

  return (
    <div className={`form-group ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-slate-400)', pointerEvents: 'none', display: 'flex' }}>
            <Icon size={18} />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`form-input ${error ? 'error' : ''}`}
          style={Icon ? { paddingLeft: '2.5rem' } : {}}
          required={required}
          {...props}
        />
      </div>

      {error && (
        <div className="form-error">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {helperText && !error && <div className="form-hint">{helperText}</div>}
    </div>
  );
}
