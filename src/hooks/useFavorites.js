import { useState, useEffect, useCallback } from 'react';

function loadFavorites() {
  try {
    const data = localStorage.getItem('slowpour_favorites');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(loadFavorites);

  useEffect(() => {
    localStorage.setItem('slowpour_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((productId) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const isFavorite = useCallback(
    (productId) => favorites.includes(productId),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}
