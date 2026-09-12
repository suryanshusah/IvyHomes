const FilterBar = ({ filters, onFilterChange }) => {
  
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const inputStyle = {
    width: '100%', 
    padding: '0.85rem 1.25rem', 
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)', 
    borderRadius: 'var(--radius-lg)',
    color: 'var(--text-primary)', 
    fontSize: '0.95rem', 
    outline: 'none',
    transition: 'all 0.2s',
  };

  const labelStyle = { 
    fontSize: '0.85rem', 
    fontWeight: '600', 
    color: 'var(--text-secondary)',
    marginBottom: '0.5rem',
    display: 'block',
    letterSpacing: '0.05em',
    textTransform: 'uppercase'
  };

  return (
    <div className="glass-panel" style={{ 
      padding: '1.5rem', 
      marginBottom: '3rem', 
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '1.25rem',
      alignItems: 'end',
      position: 'relative',
      zIndex: 10
    }}>
      <div>
        <label style={labelStyle}>Location</label>
        <input 
          style={inputStyle}
          placeholder="e.g. HSR Layout" 
          value={filters.locality || ''} 
          onChange={(e) => handleChange('locality', e.target.value)}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
        />
      </div>
      
      <div>
        <label style={labelStyle}>Bedrooms (BHK)</label>
        <input 
          style={inputStyle}
          type="number" 
          placeholder="Any" 
          value={filters.bhk || ''} 
          onChange={(e) => handleChange('bhk', e.target.value)}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
        />
      </div>

      <div>
        <label style={labelStyle}>Max Price (₹)</label>
        <input 
          style={inputStyle}
          type="number" 
          placeholder="Any Price" 
          value={filters.max_price || ''} 
          onChange={(e) => handleChange('max_price', e.target.value)}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
        />
      </div>
      
      <div>
        <label style={labelStyle}>Furnishing</label>
        <select 
          style={inputStyle}
          value={filters.furnishing || ''}
          onChange={(e) => handleChange('furnishing', e.target.value)}
        >
          <option value="">Any Furnishing</option>
          <option value="furnished">Furnished</option>
          <option value="semi-furnished">Semi-Furnished</option>
          <option value="unfurnished">Unfurnished</option>
        </select>
      </div>

      <div>
        <label style={labelStyle}>Sort Results</label>
        <select 
          style={{...inputStyle, border: '1px solid var(--accent-secondary)'}}
          value={filters.sort_by ? `${filters.sort_by}-${filters.order}` : ''}
          onChange={(e) => {
            const val = e.target.value;
            if (!val) {
              handleChange('sort_by', '');
              handleChange('order', '');
            } else {
              const [sort, order] = val.split('-');
              onFilterChange({ ...filters, sort_by: sort, order });
            }
          }}
        >
          <option value="">Recommended</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="carpet_area_sqft-desc">Size: Largest First</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
