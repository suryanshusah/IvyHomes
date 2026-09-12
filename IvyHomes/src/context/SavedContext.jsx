import { createContext, useContext, useState, useEffect } from 'react';

const SavedContext = createContext(null);

export const SavedProvider = ({ children }) => {
  const [savedProperties, setSavedProperties] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('ivy_saved');
    if (stored) {
      setSavedProperties(JSON.parse(stored));
    }
  }, []);

  const toggleSaved = (property) => {
    setSavedProperties((prev) => {
      const isSaved = prev.some((p) => p.listing_id === property.listing_id);
      let updated;
      if (isSaved) {
        updated = prev.filter((p) => p.listing_id !== property.listing_id);
      } else {
        updated = [...prev, property];
      }
      localStorage.setItem('ivy_saved', JSON.stringify(updated));
      return updated;
    });
  };

  const isSaved = (listingId) => {
    return savedProperties.some((p) => p.listing_id === listingId);
  };

  return (
    <SavedContext.Provider value={{ savedProperties, toggleSaved, isSaved }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => useContext(SavedContext);
