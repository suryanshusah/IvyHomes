import api from './api';

// Helper to compute median
const getMedian = (arr) => {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

export const computeAnalytics = async () => {
  let allListings = [];
  let offset = 0;
  const limit = 50;

  while (true) {
    const response = await api.get('/v1/listings', { params: { offset, limit } });
    const results = response.data.results;
    
    if (!results || results.length === 0) break;
    
    allListings = [...allListings, ...results];
    
    if (!response.data.has_more) break;
    offset += limit;
  }

  const activeListings = allListings.filter(l => l.is_live);

  const prices = [];
  const pricesPerSqft = [];
  const localityMap = {};
  const bhkMap = {};

  activeListings.forEach(l => {
    if (l.price != null) {
      prices.push(l.price);
    }
    if (l.price != null && l.carpet_area != null && l.carpet_area > 0) {
      pricesPerSqft.push(l.price / l.carpet_area);
    }

    if (l.locality) {
      const loc = l.locality.toLowerCase();
      if (!localityMap[loc]) localityMap[loc] = { count: 0, prices: [] };
      localityMap[loc].count += 1;
      if (l.price != null) localityMap[loc].prices.push(l.price);
    }

    if (l.bedroom != null) {
      if (!bhkMap[l.bedroom]) bhkMap[l.bedroom] = 0;
      bhkMap[l.bedroom] += 1;
    }
  });

  const by_locality = Object.keys(localityMap).map(loc => ({
    locality: loc,
    count: localityMap[loc].count,
    median_price: getMedian(localityMap[loc].prices)
  })).sort((a, b) => b.count - a.count);

  const by_bhk = Object.keys(bhkMap).map(bhk => ({
    bedroom: Number(bhk),
    count: bhkMap[bhk]
  })).sort((a, b) => a.bedroom - b.bedroom);

  return {
    city: activeListings.length > 0 && activeListings[0].city_id === 1 ? "Bangalore" : "Your City",
    total_listings: activeListings.length,
    median_price: getMedian(prices),
    median_price_per_sqft: getMedian(pricesPerSqft),
    by_locality,
    by_bhk
  };
};

export const DATA_DISCREPANCIES = [
  {
    category: "Auth",
    actual: "API key must be in the X-API-Key header, not a query parameter. Login returns 'access_token', not 'token'."
  },
  {
    category: "Pagination",
    actual: "The API uses 'offset' and ignores 'page'. The limit is capped at 50, not 200."
  },
  {
    category: "Timestamps",
    actual: "Server clock is explicitly +05:30 IST, not UTC as documented."
  },
  {
    category: "Completeness",
    actual: "/v1/listings returns inactive listings (is_live=false). They are not filtered server-side."
  },
  {
    category: "Units",
    actual: "Project price_min and price_max are in Lakhs, not raw integer Rupees."
  },
  {
    category: "Consistency",
    actual: "Project total_listings count is inaccurate and contradicts the actual listings."
  },
  {
    category: "Filters",
    actual: "Price and furnishing filters are silently ignored by the server."
  },
  {
    category: "Missing Endpoints",
    actual: "/v1/analytics/summary, /v1/favourites, and /v1/listings/{id}/similar are 404 Not Found."
  }
];
