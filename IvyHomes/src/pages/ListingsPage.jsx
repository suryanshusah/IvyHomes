import { useState, useEffect, useCallback } from 'react';
import { getListings } from '../services/api';
import ListingCard from '../components/features/ListingCard';
import FilterBar from '../components/features/FilterBar';
import InfiniteScrollTrigger from '../components/features/InfiniteScrollTrigger';
import Spinner from '../components/ui/Spinner';

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({});
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchListings = useCallback(async (currentOffset, currentFilters, append = false) => {
    setIsLoading(true);
    try {
      const data = await getListings(currentFilters, currentOffset, 50);
      
      if (append) {
        setListings(prev => [...prev, ...data.results]);
      } else {
        setListings(data.results);
      }
      
      setHasMore(data.has_more);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    setOffset(0);
    fetchListings(0, filters, false);
  }, [filters, fetchListings]);

  useEffect(() => {
    if (offset > 0) {
      fetchListings(offset, filters, true);
    }
  }, [offset, filters, fetchListings]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setOffset(prev => prev + 50);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div style={{ 
        position: 'relative', 
        padding: '4rem 0 5rem 0',
        marginBottom: '-3rem', // Pull up the filter bar over the hero
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(59,130,246,0.15) 0%, transparent 70%)'
      }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
          Find your <span className="gradient-text">dream home.</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Discover thousands of premium real estate properties for sale in your city, updated in real-time.
        </p>
      </div>

      <FilterBar filters={filters} onFilterChange={setFilters} />

      {isInitialLoad ? (
        <Spinner size={48} />
      ) : (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
            gap: '2rem' 
          }}>
            {listings.map((listing, index) => (
              <ListingCard key={`${listing.listing_id}-${index}`} listing={listing} />
            ))}
          </div>

          {listings.length === 0 && !isLoading && (
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem', opacity: 0.5 }}>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No properties found</h3>
              <p>Try adjusting your filters or expanding your search area.</p>
            </div>
          )}

          <InfiniteScrollTrigger 
            onTrigger={loadMore} 
            hasMore={hasMore} 
            isLoading={isLoading} 
          />
        </>
      )}
    </div>
  );
};

export default ListingsPage;
