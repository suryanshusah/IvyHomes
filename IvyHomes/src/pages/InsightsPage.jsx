import React, { useState, useEffect } from 'react';
import { computeAnalytics, DATA_DISCREPANCIES } from '../services/analytics';
import { Activity, AlertTriangle, Building2, MapPin, IndianRupee, Bed, RefreshCw } from 'lucide-react';

const InsightsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const stats = await computeAnalytics();
        setData(stats);
      } catch (err) {
        setError(err.message || "Failed to load insights");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Data Insights</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Real-time analytics & known discrepancies across all active listings.
          </p>
        </div>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}>
            <RefreshCw className="animate-spin" size={20} />
            <span style={{ fontWeight: 500 }}>Scanning API...</span>
          </div>
        )}
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(248, 113, 113, 0.1)', border: '1px solid var(--error)', borderRadius: 'var(--radius-md)', color: 'var(--error)', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {!loading && data && (
        <>
          {/* STATS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            
            <div className="glass-panel stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s', cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent-primary)' }}>
                  <Building2 size={24} />
                </div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Total Active Listings</h3>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
                {data.total_listings.toLocaleString()}
              </div>
            </div>

            <div className="glass-panel stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s', cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(52, 211, 153, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--success)' }}>
                  <IndianRupee size={24} />
                </div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Median Price</h3>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
                {formatCurrency(data.median_price)}
              </div>
            </div>

            <div className="glass-panel stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s', cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--accent-secondary)' }}>
                  <Activity size={24} />
                </div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Median Price / SqFt</h3>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
                {formatCurrency(data.median_price_per_sqft)}
              </div>
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            
            {/* LOCALITY BREAKDOWN */}
            <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div className="glass-header" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} color="var(--accent-primary)" />
                <h2 style={{ fontSize: '1.25rem' }}>By Locality</h2>
              </div>
              <div className="table-container" style={{ padding: '0', maxHeight: '400px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-glass-strong)' }}>
                    <tr>
                      <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 500 }}>Locality</th>
                      <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'right' }}>Listings</th>
                      <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'right' }}>Median Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.by_locality.slice(0, 15).map((loc, idx) => (
                      <tr key={idx} className="table-row" style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                        <td style={{ padding: '1rem 1.5rem', textTransform: 'capitalize' }}>{loc.locality}</td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>{loc.count}</td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>{formatCurrency(loc.median_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* BHK BREAKDOWN */}
            <div className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div className="glass-header" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bed size={20} color="var(--accent-primary)" />
                <h2 style={{ fontSize: '1.25rem' }}>By Configuration</h2>
              </div>
              <div className="table-container" style={{ padding: '0', maxHeight: '400px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-glass-strong)' }}>
                    <tr>
                      <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 500 }}>BHK</th>
                      <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'right' }}>Listings Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.by_bhk.map((bhk, idx) => (
                      <tr key={idx} className="table-row" style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                        <td style={{ padding: '1rem 1.5rem' }}>{bhk.bedroom} BHK</td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>{bhk.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
          
          {/* DISCREPANCIES SECTION */}
          <div className="glass-panel" style={{ marginBottom: '3rem' }}>
            <div className="glass-header" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertTriangle size={24} color="var(--warning)" />
              <h2 style={{ fontSize: '1.5rem' }}>API Documentation Discrepancies</h2>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                The following are known discrepancies where the provided <code style={{background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: '4px'}}>API_REFERENCE.md</code> disagrees with the actual behavior of the API.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {DATA_DISCREPANCIES.map((disc, idx) => (
                  <div key={idx} className="disc-card" style={{ padding: '1.25rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--warning)', transition: 'transform 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, color: 'var(--warning)' }}>
                        {disc.category}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>
                      {disc.actual}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* SKELETON LOADER */}
      {loading && !data && (
        <div style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
             {[1,2,3].map(i => (
               <div key={i} className="glass-panel" style={{ height: '140px', background: 'var(--bg-glass)' }} />
             ))}
           </div>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
             {[1,2].map(i => (
               <div key={i} style={{ height: '400px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)' }} className="glass-panel" />
             ))}
           </div>
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-glow);
        }
        .table-row:hover {
          background-color: var(--bg-glass-hover);
        }
        .disc-card:hover {
          transform: translateX(4px);
        }
        .table-container::-webkit-scrollbar {
          width: 6px;
        }
        .table-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .table-container::-webkit-scrollbar-thumb {
          background: var(--border-highlight);
          border-radius: 4px;
        }
        .table-container::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default InsightsPage;
