import React, { createContext, useState, useContext } from 'react';

const ScanContext = createContext();

export function ScanProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [activeScan, setActiveScan] = useState(null);

  const addScanRecord = (record) => {
    const enriched = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...record,
    };
    setHistory((prev) => [enriched, ...prev]);
    setActiveScan(enriched);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <ScanContext.Provider value={{ history, activeScan, addScanRecord, clearHistory }}>
      {children}
    </ScanContext.Provider>
  );
}

export const useScanContext = () => useContext(ScanContext);