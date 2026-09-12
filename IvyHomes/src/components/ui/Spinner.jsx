const Spinner = ({ size = 24, color = 'var(--accent-primary)' }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        stroke={color}
        style={{ animation: 'spin 1s linear infinite' }}
      >
        <style>
          {`
            @keyframes spin {
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)" strokeWidth="2">
            <circle strokeOpacity=".2" cx="11" cy="11" r="11" />
            <path d="M22 11c0-6.075-4.925-11-11-11" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Spinner;
