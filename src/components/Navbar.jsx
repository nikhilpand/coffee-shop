import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, Menu, X, UtensilsCrossed } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTable } from '../context/TableContext';

export default function Navbar({ search, favorites }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, setIsDrawerOpen } = useCart();
  const { tableNumber, openTableModal } = useTable();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/about', label: 'About' },
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-ivory/90 backdrop-blur-md border-b border-border shadow-[0_1px_8px_rgba(0,0,0,0.04)]'
            : 'bg-transparent'
        }`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <nav className="flex items-center justify-between h-16 md:h-20" aria-label="Main navigation">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="font-display text-xl md:text-2xl font-semibold text-espresso tracking-tight"
                aria-label="Slow Pour — Home"
              >
                Slow Pour
              </Link>

              {/* Table Selector Pill */}
              <button
                onClick={openTableModal}
                className="flex items-center gap-1.5 px-3 py-1 bg-cream/90 hover:bg-cream border border-border/80 rounded-full text-xs text-espresso transition-all shadow-xs"
                title="Click to change your table"
              >
                <UtensilsCrossed size={12} className="text-caramel" />
                <span className="font-semibold">Table {tableNumber}</span>
              </button>
            </div>

            {/* Center nav — desktop */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium tracking-wide uppercase transition-colors duration-200 ${
                    location.pathname === link.to
                      ? 'text-espresso font-semibold'
                      : 'text-warm-gray hover:text-espresso'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/staff"
                className="text-xs font-semibold tracking-wider uppercase text-caramel hover:text-espresso bg-cream/80 px-3 py-1 rounded-full border border-border/60 transition-colors"
              >
                Barista Station
              </Link>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 md:gap-3">
              <button
                onClick={search.open}
                className="p-2 rounded-full text-warm-gray hover:text-espresso hover:bg-cream transition-all duration-200"
                aria-label="Search"
              >
                <Search size={19} strokeWidth={1.8} />
              </button>

              <Link
                to="/favorites"
                className="hidden md:flex p-2 rounded-full text-warm-gray hover:text-espresso hover:bg-cream transition-all duration-200 relative"
                aria-label={`Favorites (${favorites.favorites.length})`}
              >
                <Heart
                  size={19}
                  strokeWidth={1.8}
                  className={favorites.favorites.length > 0 ? 'fill-caramel text-caramel' : ''}
                />
              </Link>

              <button
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 rounded-full text-warm-gray hover:text-espresso hover:bg-cream transition-all duration-200 relative"
                aria-label={`Cart (${itemCount} items)`}
              >
                <ShoppingBag size={19} strokeWidth={1.8} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.5 }}
                      className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-espresso text-ivory text-[10px] font-semibold rounded-full flex items-center justify-center"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-full text-warm-gray hover:text-espresso hover:bg-cream transition-all duration-200"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-overlay md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-ivory border-l border-border p-8 pt-24 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-6">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openTableModal();
                  }}
                  className="flex items-center justify-between p-3.5 bg-cream rounded-2xl border border-border/80 text-left"
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold text-warm-gray block">Your Seating</span>
                    <span className="font-display text-lg font-bold text-espresso">Table {tableNumber}</span>
                  </div>
                  <span className="text-xs font-semibold text-caramel">Change</span>
                </button>

                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`font-display text-2xl transition-colors ${
                      location.pathname === link.to ? 'text-espresso' : 'text-warm-gray'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/favorites"
                  className="font-display text-2xl text-warm-gray transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Favorites
                </Link>
                <Link
                  to="/staff"
                  className="font-display text-xl text-caramel transition-colors pt-2 border-t border-border/60"
                  onClick={() => setMobileOpen(false)}
                >
                  Barista Station ☕
                </Link>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-xs text-warm-gray">
                  Mon – Fri: 8 AM – 9 PM<br />
                  Sat – Sun: 9 AM – 10 PM
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
