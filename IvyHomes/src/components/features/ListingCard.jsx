import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useSaved } from '../../context/SavedContext';

const ListingCard = ({ listing, isRental = false }) => {
  const { toggleSaved, isSaved } = useSaved();
  const saved = isSaved(listing.listing_id);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(listing);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const imageSeed = (listing.listing_id || 'home').replace(/[^a-zA-Z0-9]/g, '');

  return (
    <Link to={`/${isRental ? 'rentals' : 'listings'}/${listing.listing_id}`} style={{ display: 'block' }}>
      <Card hover style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid var(--border-color)' }}>
        
        {/* Image Header */}
        <div style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
          <img 
            src={`https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop&seed=${imageSeed}`} 
            alt="Property"
            className="image-placeholder"
            style={{ width: '100%', height: '100%', borderRadius: 0 }}
          />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7))',
            pointerEvents: 'none'
          }} />
          
          <button 
            onClick={handleSave}
            style={{
              position: 'absolute', top: '1rem', right: '1rem', zIndex: 10,
              background: saved ? '#fff' : 'rgba(0,0,0,0.4)', 
              backdropFilter: 'blur(4px)',
              borderRadius: '50%', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: saved ? 'none' : '1px solid rgba(255,255,255,0.3)', 
              color: saved ? 'var(--error)' : '#fff',
              transition: 'all 0.2s',
              pointerEvents: 'auto'
            }}
            title={saved ? "Remove from saved" : "Save property"}
          >
            <span style={{ fontSize: '1.25rem', marginTop: '2px' }}>{saved ? '♥' : '♡'}</span>
          </button>
          
          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Badge variant={listing.is_live ? 'success' : 'error'}>
              {listing.is_live ? 'Live' : 'Inactive'}
            </Badge>
            {listing.furnishing && (
              <Badge variant="default" style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                {listing.furnishing}
              </Badge>
            )}
            {listing.property_type && (
              <Badge variant="info" style={{ background: 'rgba(59,130,246,0.8)' }}>
                {listing.property_type}
              </Badge>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.35rem', color: 'var(--text-primary)', lineHeight: '1.3', textTransform: 'capitalize' }}>
            {listing.bedroom ? `${listing.bedroom} BHK ` : 'Studio '} 
            {listing.apartment_name ? `in ${listing.apartment_name}` : 'Apartment'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'capitalize' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {listing.locality}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Area</p>
              <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{listing.carpet_area || listing.super_built_up_area || 'N/A'} sqft</p>
            </div>
            {listing.floor !== undefined && (
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Floor</p>
                <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                  {listing.floor === 0 ? 'Ground' : listing.floor} {listing.total_floors ? `/ ${listing.total_floors}` : ''}
                </p>
              </div>
            )}
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                {isRental ? 'Monthly Rent' : 'Asking Price'}
              </p>
              <p className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: '700', lineHeight: '1' }}>
                {formatPrice(listing.price)}
              </p>
              {isRental && listing.deposit && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>+ {formatPrice(listing.deposit)} dep.</p>
              )}
            </div>
            {listing.posted_by_name && (
               <div style={{ textAlign: 'right' }}>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Listed by</p>
                 <p style={{ fontSize: '0.85rem', fontWeight: '500' }}>{listing.posted_by_name}</p>
               </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ListingCard;
