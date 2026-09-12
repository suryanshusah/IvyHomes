const Input = ({ label, className = '', ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <input
        className={className}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)',
          fontSize: '1rem',
          outline: 'none',
          transition: 'border-color var(--transition-fast)',
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
        onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
        {...props}
      />
    </div>
  );
};

export default Input;
