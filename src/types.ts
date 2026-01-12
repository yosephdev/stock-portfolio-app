export interface Stock {
  id: string; 
  name: string;
  symbol: string;
  shares_owned: number;
  cost_per_share: number;
  market_price: number;
  daily_change?: number;
  last_updated?: string;
}

export interface PortfolioState {
  portfolio: Stock[];
  form: Omit<Stock, 'id'>;
  errors: Record<string, string>;
  loading: boolean;
  selectedStock?: Stock;
}

export type PortfolioAction = 
  | { type: 'LOAD_PORTFOLIO'; payload: Stock[] }
  | { type: 'ADD_STOCK'; payload: Stock }
  | { type: 'REMOVE_STOCK'; id: string }
  | { type: 'UPDATE_STOCK'; payload: Partial<Stock>; id: string }
  | { type: 'UPDATE_FORM'; field: keyof Omit<Stock, 'id'>; value: string | number }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'UPDATE_PRICES'; updates: Array<{ id: string; price: number; change: number }> }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SELECT_STOCK'; stock?: Stock };