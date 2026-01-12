import React from 'react';
import type { Stock } from '../types';

interface PortfolioMetricsProps {
  portfolio: Stock[];
  prices: Record<string, { price: number; change: number }>;
}

export const PortfolioMetrics: React.FC<PortfolioMetricsProps> = ({ portfolio, prices }) => {
  const totalMarketValue = portfolio.reduce((sum, stock) => 
    sum + (stock.shares_owned * stock.market_price), 0
  );
  
  const totalCost = portfolio.reduce((sum, stock) => 
    sum + (stock.shares_owned * stock.cost_per_share), 0
  );
  
  const totalGainLoss = totalMarketValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
  
  const dailyChange = portfolio.reduce((sum, stock) => {
    const stockValue = stock.shares_owned * stock.market_price;
    const dailyChangePercent = prices[stock.symbol]?.change || 0;
    return sum + (stockValue * dailyChangePercent / 100);
  }, 0);

  // Calculate beta-weighted exposure
  // For simplicity, using mock beta values
  const mockBeta: Record<string, number> = {
    'FB': 1.2, 'AMZN': 1.3, 'SNAP': 1.8
  };

  const portfolioBeta = portfolio.reduce((sum, stock) => {
    const stockWeight = totalMarketValue > 0 ? (stock.shares_owned * stock.market_price) / totalMarketValue : 0;
    const beta = mockBeta[stock.symbol] || 1.0;
    return sum + (stockWeight * beta);
  }, 0);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-label">Total Value</div>
        <div className="stat-value">${totalMarketValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-label">Total Gain/Loss</div>
        <div className={`stat-value ${totalGainLoss >= 0 ? 'text-success' : 'text-danger'}`}>
          ${totalGainLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
          <span className="text-sm ml-2">({totalGainLossPercent.toFixed(2)}%)</span>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-label">Daily P&L</div>
        <div className={`stat-value ${dailyChange >= 0 ? 'text-success' : 'text-danger'}`}>
          ${dailyChange.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-label">Portfolio Beta</div>
        <div className="stat-value">{portfolioBeta.toFixed(2)}</div>
        <div className="text-sm text-muted">Overall market risk exposure</div>
      </div>
    </div>
  );
};