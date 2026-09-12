const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.625rem 1.25rem',
    borderRadius: 'var(--radius-md)',
    fontWeight: '500',
    transition: 'all var(--transition-fast)',
    fontSize: '0.95rem',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--accent-primary)',
      color: '#fff',
      boxShadow: 'var(--shadow-md)',
    },
    secondary: {
      backgroundColor: 'var(--bg-glass)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)',
    },
    danger: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: 'var(--error)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
    }
  };

  return (
    <button 
      style={{ ...baseStyle, ...variants[variant] }}
      className={className}
      onMouseEnter={(e) => {
        if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--accent-primary-hover)';
        if (variant === 'secondary') e.currentTarget.style.backgroundColor = 'var(--bg-glass-hover)';
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
        if (variant === 'secondary') e.currentTarget.style.backgroundColor = 'var(--bg-glass)';
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
