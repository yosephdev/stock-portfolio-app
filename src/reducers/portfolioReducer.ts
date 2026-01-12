import type { PortfolioState, PortfolioAction } from '../types';

export const portfolioReducer = (state: PortfolioState, action: PortfolioAction): PortfolioState => {
  switch (action.type) {
    case 'LOAD_PORTFOLIO':
      return { ...state, portfolio: action.payload };
    
    case 'ADD_STOCK':
      return {
        ...state,
        portfolio: [...state.portfolio, action.payload],
        errors: {},
      };
    
    case 'REMOVE_STOCK':
      return {
        ...state,
        portfolio: state.portfolio.filter(stock => stock.id !== action.id),
      };
    
    case 'UPDATE_STOCK':
      return {
        ...state,
        portfolio: state.portfolio.map(stock =>
          stock.id === action.id ? { ...stock, ...action.payload, last_updated: new Date().toISOString() } : stock
        ),
      };
    
    case 'UPDATE_FORM':
      return {
        ...state,
        form: { ...state.form, [action.field]: action.value },
        errors: { ...state.errors, [action.field]: '' },
      };
    
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    
    case 'UPDATE_PRICES':
      { const updatedPortfolio = [...state.portfolio];
      action.updates.forEach(update => {
        const index = updatedPortfolio.findIndex(stock => stock.id === update.id);
        if (index !== -1) {
          updatedPortfolio[index] = {
            ...updatedPortfolio[index],
            market_price: update.price,
            daily_change: update.change,
            last_updated: new Date().toISOString(),
          };
        }
      });
      return { ...state, portfolio: updatedPortfolio }; }
    
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    
    case 'SELECT_STOCK':
      return { ...state, selectedStock: action.stock };
    
    default:
      return state;
  }
};