import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon = null,
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 18} style={{ animation: 'spin 1s linear infinite' }} />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : 18} />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
