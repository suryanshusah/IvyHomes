import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById, getRentalById } from '../services/api';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { useSaved } from '../context/SavedContext';

const ListingDetailPage = ({ isRental = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { toggleSaved, isSaved } = useSaved();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const data = isRental ? await getRentalById(id) : await getListingById(id);
        setListing(data);
      } catch (err) {
        setError('Failed to fetch property details.');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, isRental]);

  if (loading) return <Spinner size={48} />;
  
  if (error) return (
    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--error)' }}>
      <h3>{error}</h3>
      <Button variant="secondary" onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>Go Back</Button>
    </div>
  );

  if (!listing) return null;

  const saved = isSaved(listing.listing_id);

  const formatPrice = (price) => {
    if (price === undefined) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const imageSeed = (listing.listing_id || 'home').replace(/[^a-zA-Z0-9]/g, '');
  const titleStr = isRental ? listing.title || `${listing.bedroom || 'Studio'} BHK in ${listing.locality}` : `${listing.bedroom || 'Studio'} BHK in ${listing.apartment_name || listing.locality}`;

  return (
    <div>
      <Button variant="secondary" onClick={() => navigate(-1)} style={{ marginBottom: '2rem', color: '#fff', background: 'rgba(255,255,255,0.1)' }}>
        ← Back to Results
      </Button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Massive Image Hero */}
        <div style={{ position: 'relative', height: '400px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
          <img 
            src={`https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop&seed=${imageSeed}`} 
            alt="Property"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <button 
            onClick={() => toggleSaved(listing)}
            style={{
              position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10,
              background: saved ? '#fff' : 'rgba(0,0,0,0.5)', 
              backdropFilter: 'blur(8px)',
              borderRadius: '50%', width: '48px', height: '48px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
              border: saved ? 'none' : '1px solid rgba(255,255,255,0.3)', 
              color: saved ? 'var(--error)' : '#fff',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            title={saved ? "Remove from saved" : "Save property"}
          >
            <span style={{ marginTop: '2px' }}>{saved ? '♥' : '♡'}</span>
          </button>
          
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <Badge variant={listing.is_live ? 'success' : 'error'}>
                {listing.is_live ? 'Live' : 'Inactive'}
              </Badge>
              {listing.property_type && <Badge variant="info">{listing.property_type}</Badge>}
              {listing.is_verified && <Badge variant="success">Verified ✔</Badge>}
            </div>
            <h1 style={{ fontSize: '3rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.5)', textTransform: 'capitalize' }}>
              {titleStr}
            </h1>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Main Content Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Description */}
            <Card hover={false}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>About the Property</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                {listing.description || 'No description provided.'}
              </p>
            </Card>

            {/* Detailed Facts Grid */}
            <Card hover={false}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Property Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
                {listing.bedroom !== undefined && (
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Bedrooms</p>
                    <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>{listing.bedroom}</p>
                  </div>
                )}
                {listing.bathroom !== undefined && (
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Bathrooms</p>
                    <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>{listing.bathroom}</p>
                  </div>
                )}
                {listing.balcony !== undefined && (
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Balconies</p>
                    <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>{listing.balcony}</p>
                  </div>
                )}
                {listing.floor !== undefined && (
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Floor Level</p>
                    <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>
                      {listing.floor === 0 ? 'Ground' : listing.floor} {listing.total_floors ? `out of ${listing.total_floors}` : ''}
                    </p>
                  </div>
                )}
                {listing.facing_direction && (
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Facing</p>
                    <p style={{ fontWeight: '500', fontSize: '1.1rem', textTransform: 'capitalize' }}>{listing.facing_direction.replace('-', ' ')}</p>
                  </div>
                )}
                {listing.covered_parking !== undefined && (
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Covered Parking</p>
                    <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>{listing.covered_parking} spaces</p>
                  </div>
                )}
                {listing.furnishing && (
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Furnishing</p>
                    <p style={{ fontWeight: '500', fontSize: '1.1rem', textTransform: 'capitalize' }}>{listing.furnishing.replace('-', ' ')}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Pricing Card */}
            <Card hover={false} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--primary)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isRental ? 'Monthly Rent' : 'Asking Price'}
              </p>
              <p className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>
                {formatPrice(listing.price)}
              </p>
              
              {isRental && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  {listing.deposit !== undefined && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Security Deposit</span>
                      <span style={{ fontWeight: '500' }}>{formatPrice(listing.deposit)}</span>
                    </div>
                  )}
                  {listing.maintenance !== undefined && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Maintenance</span>
                      <span style={{ fontWeight: '500' }}>{formatPrice(listing.maintenance)}</span>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                 <span style={{ color: 'var(--text-muted)' }}>Carpet Area</span>
                 <span style={{ fontWeight: '500' }}>{listing.carpet_area || listing.super_built_up_area || 'N/A'} sqft</span>
              </div>
            </Card>

            {/* Contact Card */}
            <Card hover={false}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Contact {listing.posted_by || 'Agent'}</h3>
              <p style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{listing.posted_by_name || 'N/A'}</p>
              <Button style={{ width: '100%', marginBottom: '1rem' }} onClick={() => alert(`Calling ${listing.posted_by_contact}...`)}>
                {listing.posted_by_contact || 'Contact Not Available'}
              </Button>
              {listing.posted_at && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  Posted on: {new Date(listing.posted_at).toLocaleDateString()}
                </p>
              )}
            </Card>

            {/* Location Map Link */}
            {listing.latitude && listing.longitude && (
              <Card hover={false} style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Location</h3>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${listing.latitude},${listing.longitude}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  View on Google Maps
                </a>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
