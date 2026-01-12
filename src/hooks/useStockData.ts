import { useEffect, useState, useCallback, useRef } from 'react';

export const useStockData = (symbols: string[], refreshInterval = 300000) => {
  const [prices, setPrices] = useState<Record<string, { price: number; change: number }>>({});
  const [loading, setLoading] = useState(false);
  const symbolsRef = useRef<string[]>([]);
  const intervalRef = useRef<number | null>(null);

  const fetchStockData = useCallback(async (symbolsToFetch: string[]) => {
    if (symbolsToFetch.length === 0) return;
    
    setLoading(true);
    try {
      const requests = symbolsToFetch.map(async (symbol) => {
        try {
          const apiKey = import.meta.env.VITE_API_KEY || 'demo';
          const response = await fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
          );
          const data = await response.json();
          
          // Handle API rate limit
          if (data['Note'] || data['Information']) {
            console.warn(`API rate limit or error for ${symbol}:`, data['Note'] || data['Information']);
            return null;
          }
          
          const quote = data['Global Quote'];
          if (quote && quote['05. price']) {
            return {
              symbol,
              price: parseFloat(quote['05. price']),
              change: parseFloat(quote['10. change percent']?.replace('%', '') || '0'),
            };
          }
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
        }
        return null;
      });

      const results = await Promise.all(requests);
      const newPrices: Record<string, { price: number; change: number }> = {};
      
      results.forEach((result) => {
        if (result) {
          newPrices[result.symbol] = { price: result.price, change: result.change };
        }
      });

      setPrices((prev) => ({ ...prev, ...newPrices }));
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Compare symbols to avoid unnecessary fetches
    const symbolsString = symbols.sort().join(',');
    const prevSymbolsString = symbolsRef.current.sort().join(',');
    
    if (symbolsString !== prevSymbolsString) {
      symbolsRef.current = symbols;
      
      // Clear existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (symbols.length > 0) {
        fetchStockData(symbols);
        intervalRef.current = window.setInterval(() => fetchStockData(symbols), refreshInterval);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [symbols, refreshInterval, fetchStockData]);

  return { prices, loading, fetchStockData };
};