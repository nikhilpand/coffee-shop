import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import CartDrawer from './components/CartDrawer';
import SearchOverlay from './components/SearchOverlay';
import TableModal from './components/TableModal';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Product from './pages/Product';
import About from './pages/About';
import FavoritesPage from './pages/Favorites';
import OrderStatus from './pages/OrderStatus';
import StaffDashboard from './pages/StaffDashboard';
import { useSearch } from './hooks/useSearch';
import { useFavorites } from './hooks/useFavorites';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const search = useSearch();
  const favorites = useFavorites();

  const isStaffRoute = location.pathname.startsWith('/staff');

  return (
    <div className="min-h-screen bg-ivory">
      <ScrollToTop />
      {!isStaffRoute && <Navbar search={search} favorites={favorites} />}
      <SearchOverlay search={search} />
      <CartDrawer />
      <TableModal />
      <Toast />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Home favorites={favorites} />
              </PageTransition>
            }
          />
          <Route
            path="/menu"
            element={
              <PageTransition>
                <Menu favorites={favorites} />
              </PageTransition>
            }
          />
          <Route
            path="/product/:id"
            element={
              <PageTransition>
                <Product favorites={favorites} />
              </PageTransition>
            }
          />
          <Route
            path="/about"
            element={
              <PageTransition>
                <About />
              </PageTransition>
            }
          />
          <Route
            path="/favorites"
            element={
              <PageTransition>
                <FavoritesPage favorites={favorites} />
              </PageTransition>
            }
          />
          <Route
            path="/order/:orderId"
            element={
              <PageTransition>
                <OrderStatus />
              </PageTransition>
            }
          />
          <Route path="/staff" element={<StaffDashboard />} />
        </Routes>
      </AnimatePresence>

      {!isStaffRoute && <Footer />}
    </div>
  );
}

