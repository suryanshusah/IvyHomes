const Badge = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    info: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa' },
    success: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399' },
    warning: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24' },
    error: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171' },
    default: { bg: 'var(--bg-secondary)', text: 'var(--text-secondary)' }
  };

  const style = variants[variant] || variants.default;

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.25rem 0.625rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: '600',
        backgroundColor: style.bg,
        color: style.text,
        letterSpacing: '0.025em',
        textTransform: 'uppercase'
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
