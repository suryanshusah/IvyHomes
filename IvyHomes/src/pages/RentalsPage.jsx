import React, { useState, useEffect, useCallback } from 'react';
import { getRentals } from '../services/api';
import ListingCard from '../components/features/ListingCard';
import FilterBar from '../components/features/FilterBar';
import InfiniteScrollTrigger from '../components/features/InfiniteScrollTrigger';
import Spinner from '../components/ui/Spinner';

const RentalsPage = () => {
  const [rentals, setRentals] = useState([]);
  const [filters, setFilters] = useState({});
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchRentals = useCallback(async (currentOffset, currentFilters, append = false) => {
    setIsLoading(true);
    try {
      const data = await getRentals(currentFilters, currentOffset, 50);
      
      if (append) {
        setRentals(prev => [...prev, ...data.results]);
      } else {
        setRentals(data.results);
      }
      
      setHasMore(data.has_more);
    } catch (error) {
      console.error("Failed to fetch rentals:", error);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    setOffset(0);
    fetchRentals(0, filters, false);
  }, [filters, fetchRentals]);

  useEffect(() => {
    if (offset > 0) {
      fetchRentals(offset, filters, true);
    }
  }, [offset, filters, fetchRentals]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setOffset(prev => prev + 50);
    }
  };

  return (
    <div>
      <div style={{ 
        position: 'relative', 
        padding: '4rem 0 3rem 0',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(139,92,246,0.15) 0%, transparent 70%)'
      }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
          Properties for <span className="gradient-text">Rent.</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Find your next perfect rental home with Ivy.
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
            {rentals.map((rental, index) => (
              <ListingCard key={`rental-${rental.listing_id}-${index}`} listing={rental} isRental />
            ))}
          </div>

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

export default RentalsPage;
