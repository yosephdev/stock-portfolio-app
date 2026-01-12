import { useMemo } from 'react';

export const useHistoricalData = (portfolioValue: number) => {
  // Use useMemo to compute historical data based on portfolio value changes
  const historicalData = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem('portfolioHistory');
    const history = stored ? JSON.parse(stored) : [];
    
    const lastEntry = history[history.length - 1];
    if (!lastEntry || lastEntry.date !== today) {
      const newHistory = [...history, { date: today, value: portfolioValue }];
      // Keep only last 30 days
      const recentHistory = newHistory.slice(-30);
      localStorage.setItem('portfolioHistory', JSON.stringify(recentHistory));
      return recentHistory;
    }
    return history;
  }, [portfolioValue]);

  return historicalData;
};