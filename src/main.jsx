import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './context/CartContext';
import { TableProvider } from './context/TableContext';
import SplashScreen from './components/SplashScreen';
import './index.css';

function Root() {
  // Show splash only once per browser session
  const [splashDone, setSplashDone] = useState(
    () => sessionStorage.getItem('sp_splash') === '1'
  );

  const handleSplashDone = useCallback(() => {
    sessionStorage.setItem('sp_splash', '1');
    setSplashDone(true);
  }, []);

  return (
    <>
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}
      <BrowserRouter>
        <TableProvider>
          <CartProvider>
            <App splashDone={splashDone} />
          </CartProvider>
        </TableProvider>
      </BrowserRouter>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
