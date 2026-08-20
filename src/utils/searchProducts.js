import products from '../data/products';

export function searchProducts(query) {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  return products.filter((p) => {
    const haystack = [
      p.name,
      p.category,
      p.description,
      ...(p.ingredients || []),
      ...(p.tags || []),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}
