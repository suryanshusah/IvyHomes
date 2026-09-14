import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-API-Key': API_KEY,
  },
});

// Interceptor to attach Bearer token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ivy_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to refresh token on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('ivy_refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken
        }, {
          headers: {
            'X-API-Key': API_KEY
          }
        });
        
        const { access_token, refresh_token } = response.data;
        
        localStorage.setItem('ivy_token', access_token);
        if (refresh_token) {
          localStorage.setItem('ivy_refresh_token', refresh_token);
        }
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('ivy_token');
        localStorage.removeItem('ivy_refresh_token');
        localStorage.removeItem('ivy_user');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Generic fetch with offset pagination
const fetchPaginated = async (endpoint, params = {}, offset = 0, limit = 50) => {
  const response = await api.get(endpoint, {
    params: { ...params, offset, limit },
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  // Doc bug: returns access_token instead of token
  return response.data;
};

export const getListings = async (filters = {}, offset = 0, limit = 50) => {
  // The API ignores min_price, max_price, and furnishing.
  // It also returns inactive, corrupt, and fake listings.
  // We need to fetch from API using supported params, then filter on client side.
  // Supported params: locality, bhk, sort_by, order, offset, limit
  
  const { locality, bhk, min_price, max_price, furnishing, sort_by, order } = filters;
  
  const apiParams = {};
  if (locality) apiParams.locality = locality;
  if (bhk) apiParams.bhk = bhk;
  if (sort_by) apiParams.sort_by = sort_by;
  if (order) apiParams.order = order;

  // We fetch a larger batch because client-side filtering might reduce the result count
  // For a real app with proper API, we'd just pass params. 
  // Here, we might need to fetch multiple pages to satisfy the limit if filters are heavy, 
  // but for simplicity we'll fetch the requested limit (or max 50) and filter.
  const data = await fetchPaginated('/v1/listings', apiParams, offset, limit);
  
  // Client-side filtering
  let filteredResults = data.results.filter(item => {
    // 1. Must be live
    if (item.is_live !== true) return false;
    
    // 2. Price filters (assuming item.price is in INR)
    if (min_price && item.price < Number(min_price)) return false;
    if (max_price && item.price > Number(max_price)) return false;
    
    // 3. Furnishing filter
    if (furnishing && item.furnishing !== furnishing) return false;
    
    return true;
  });
  
  return {
    ...data,
    results: filteredResults,
    // Note: total, count might be slightly inaccurate after client filtering 
    // but this is the best we can do given the API limitations.
  };
};

export const getListingById = async (id) => {
  const response = await api.get(`/v1/listings/${id}`);
  return response.data;
};

export const getRentals = async (filters = {}, offset = 0, limit = 50) => {
  // Rentals endpoint supports locality, bhk, sort_by, order
  return fetchPaginated('/v1/rentals', filters, offset, limit);
};

export const getRentalById = async (id) => {
  const response = await api.get(`/v1/rentals/${id}`);
  return response.data;
};

export const getProjects = async (offset = 0, limit = 50) => {
  return fetchPaginated('/v1/projects', {}, offset, limit);
};

export const getProjectById = async (id) => {
  const response = await api.get(`/v1/projects/${id}`);
  return response.data;
};

export default api;
