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

const fetchPaginated = async (endpoint, params = {}, offset = 0, limit = 50) => {
  const response = await api.get(endpoint, {
    params: { ...params, offset, limit },
  });
  return response.data;
};

export default api;