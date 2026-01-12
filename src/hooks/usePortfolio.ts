import { useReducer, useCallback } from 'react';
import { portfolioReducer } from '../reducers/portfolioReducer';
import type { Stock } from '../types';

export const usePortfolio = (initialPortfolio: Stock[]) => {
  const [state, dispatch] = useReducer(portfolioReducer, {
    portfolio: initialPortfolio,
    form: { name: '', symbol: '', shares_owned: 0, cost_per_share: 0, market_price: 0 },
    errors: {},
    loading: false,
  });

  const addStock = useCallback((stock: Omit<Stock, 'id'>) => {
    const newStock: Stock = {
      ...stock,
      id: crypto.randomUUID(),
      last_updated: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_STOCK', payload: newStock });
  }, []);

  const updateStock = useCallback((id: string, updates: Partial<Stock>) => {
    dispatch({ type: 'UPDATE_STOCK', id, payload: updates });
  }, []);

  const updateStockField = useCallback((id: string, field: keyof Stock, value: number) => {
    dispatch({ type: 'UPDATE_STOCK', id, payload: { [field]: value } });
  }, []);

  const removeStock = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_STOCK', id });
  }, []);

  const selectStock = useCallback((stock?: Stock) => {
    dispatch({ type: 'SELECT_STOCK', stock });
  }, []);

  return {
    state,
    dispatch,
    addStock,
    updateStock,
    updateStockField,
    removeStock,
    selectStock,
  };
};