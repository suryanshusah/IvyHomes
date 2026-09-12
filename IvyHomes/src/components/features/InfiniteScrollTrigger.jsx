import { useEffect, useRef } from 'react';
import Spinner from '../ui/Spinner';

const InfiniteScrollTrigger = ({ onTrigger, hasMore, isLoading }) => {
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onTrigger();
        }
      },
      { threshold: 0.1 }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => {
      if (triggerRef.current) {
        observer.unobserve(triggerRef.current);
      }
    };
  }, [hasMore, isLoading, onTrigger]);

  if (!hasMore) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
        No more results
      </div>
    );
  }

  return (
    <div ref={triggerRef} style={{ padding: '2rem 0', display: 'flex', justifyContent: 'center' }}>
      {isLoading && <Spinner size={32} />}
    </div>
  );
};

export default InfiniteScrollTrigger;
