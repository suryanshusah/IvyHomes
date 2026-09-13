import React from 'react';
import { useSaved } from '../context/SavedContext';
import ListingCard from '../components/features/ListingCard';

const SavedPage = () => {
  const { savedProperties } = useSaved();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Saved Properties</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Your shortlisted homes and rentals.</p>
      </div>

      {savedProperties.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <h3>No saved properties</h3>
          <p>Click the heart icon on any listing to save it here.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {savedProperties.map((property) => (
            <ListingCard 
              key={`saved-${property.listing_id}`} 
              listing={property} 
              isRental={property.listing_id.startsWith('R')} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPage;
