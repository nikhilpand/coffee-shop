import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const TableContext = createContext(null);
const STORAGE_KEY = 'slowpour_active_table';

export function TableProvider({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tableNumber, setTableNumberState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? parseInt(stored, 10) : 1; // Default to Table 1 if not specified
    } catch {
      return 1;
    }
  });
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  // Check URL query param `?table=X`
  useEffect(() => {
    const tableParam = searchParams.get('table');
    if (tableParam) {
      const parsed = parseInt(tableParam, 10);
      if (!isNaN(parsed) && parsed > 0 && parsed <= 24) {
        setTableNumberState(parsed);
        try {
          localStorage.setItem(STORAGE_KEY, parsed.toString());
        } catch {
          // ignore
        }
      }
    }
  }, [searchParams]);

  const setTableNumber = useCallback((num) => {
    const parsed = parseInt(num, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 24) {
      setTableNumberState(parsed);
      try {
        localStorage.setItem(STORAGE_KEY, parsed.toString());
      } catch {
        // ignore
      }
    }
  }, []);

  const openTableModal = useCallback(() => setIsTableModalOpen(true), []);
  const closeTableModal = useCallback(() => setIsTableModalOpen(false), []);

  return (
    <TableContext.Provider
      value={{
        tableNumber,
        setTableNumber,
        isTableModalOpen,
        openTableModal,
        closeTableModal,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}

export function useTable() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTable must be used within TableProvider');
  }
  return context;
}
