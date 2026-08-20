import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './context/CartContext';
import { TableProvider } from './context/TableContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TableProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </TableProvider>
    </BrowserRouter>
  </React.StrictMode>
);
