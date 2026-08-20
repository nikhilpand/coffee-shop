import { useState, useMemo, useCallback, useEffect } from 'react';
import { searchProducts } from '../utils/searchProducts';

function loadRecent() {
  try {
    const data = localStorage.getItem('slowpour_recent_searches');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(loadRecent);

  const results = useMemo(() => searchProducts(query), [query]);

  useEffect(() => {
    localStorage.setItem('slowpour_recent_searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const addRecent = useCallback((term) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== term.toLowerCase());
      return [term, ...filtered].slice(0, 5);
    });
  }, []);

  const clearRecent = useCallback(() => setRecentSearches([]), []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  return { query, setQuery, results, isOpen, open, close, recentSearches, addRecent, clearRecent };
}
