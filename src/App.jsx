import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import CartDrawer from './components/CartDrawer';
import SearchOverlay from './components/SearchOverlay';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Product from './pages/Product';
import About from './pages/About';
import FavoritesPage from './pages/Favorites';
import { useSearch } from './hooks/useSearch';
import { useFavorites } from './hooks/useFavorites';

export default function App() {
  const location = useLocation();
  const search = useSearch();
  const favorites = useFavorites();

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar search={search} favorites={favorites} />
      <SearchOverlay search={search} />
      <CartDrawer />
      <Toast />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home favorites={favorites} />} />
          <Route path="/menu" element={<Menu favorites={favorites} />} />
          <Route path="/product/:id" element={<Product favorites={favorites} />} />
          <Route path="/about" element={<About />} />
          <Route path="/favorites" element={<FavoritesPage favorites={favorites} />} />
        </Routes>
      </AnimatePresence>

      <Footer />
    </div>
  );
}
