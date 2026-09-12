const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`glass-panel ${className}`}
      style={{
        padding: '1.5rem',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
        cursor: hover ? 'pointer' : 'default',
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
