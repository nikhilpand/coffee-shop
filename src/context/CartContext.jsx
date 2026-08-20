import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const CartContext = createContext(null);

function loadCart() {
  try {
    const data = localStorage.getItem('slowpour_cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('slowpour_cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, size = null, qty = 1, customizations = null) => {
    const sizeLabel = size?.label || product.sizes?.[0]?.label || 'Regular';
    const basePrice = size?.price || product.sizes?.[0]?.price || product.price;

    let addonPrice = 0;
    if (customizations?.milkPrice) {
      addonPrice += customizations.milkPrice;
    }
    if (customizations?.extrasPrices) {
      addonPrice += Object.values(customizations.extrasPrices).reduce((a, b) => a + b, 0);
    }

    const finalUnitPrice = basePrice + addonPrice;

    // Create unique key based on id, size, milk, extras, and note
    const customKeySuffix = customizations
      ? `${customizations.milkLabel || ''}-${(customizations.extrasLabels || []).sort().join('-')}-${customizations.note || ''}`
      : '';
    const key = `${product.id}-${sizeLabel}-${customKeySuffix}`;

    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          image: product.image,
          category: product.category,
          size: sizeLabel,
          price: finalUnitPrice,
          basePrice,
          customizations: customizations || {},
          quantity: qty,
        },
      ];
    });
    setToast(`${product.name} added to your order.`);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.key !== key));
      return;
    }
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity } : i)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const tax = useMemo(() => Math.round(subtotal * 0.05), [subtotal]);
  const total = subtotal + tax;
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      tax,
      total,
      itemCount,
      isDrawerOpen,
      setIsDrawerOpen,
      toast,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, subtotal, tax, total, itemCount, isDrawerOpen, toast]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
