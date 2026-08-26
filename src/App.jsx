import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Coffee } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import CartDrawer from './components/CartDrawer';
import SearchOverlay from './components/SearchOverlay';
import TableModal from './components/TableModal';
import PageTransition from './components/PageTransition';
import ErrorBoundary from './components/ErrorBoundary';
import { useSearch } from './hooks/useSearch';
import { useFavorites } from './hooks/useFavorites';

// Lazy Loaded Routes for optimal initial chunk performance
const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const Product = lazy(() => import('./pages/Product'));
const About = lazy(() => import('./pages/About'));
const FavoritesPage = lazy(() => import('./pages/Favorites'));
const OrderStatus = lazy(() => import('./pages/OrderStatus'));
const StaffDashboard = lazy(() => import('./pages/StaffDashboard'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center animate-bounce">
        <Coffee size={20} className="text-caramel" />
      </div>
    </div>
  );
}

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
    <ErrorBoundary>
      <div className="min-h-screen bg-ivory">
        <ScrollToTop />
        {!isStaffRoute && <Navbar search={search} favorites={favorites} />}
        <SearchOverlay search={search} />
        <CartDrawer />
        <TableModal />
        <Toast />

        <Suspense fallback={<PageLoader />}>
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
        </Suspense>

        {!isStaffRoute && <Footer />}
      </div>
    </ErrorBoundary>
  );
}
