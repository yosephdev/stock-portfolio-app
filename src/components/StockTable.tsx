import React from 'react';
import type { Stock } from '../types';

interface StockTableProps {
  stocks: Stock[];
  onUpdate: (id: string, field: keyof Stock, value: number) => void;
  onRemove: (id: string) => void;
  prices: Record<string, { price: number; change: number }>;
}

export const StockTable: React.FC<StockTableProps> = ({ stocks, onUpdate, onRemove, prices }) => {
  return (
    <div className="table-responsive">
      <table className="portfolio-table">
        <thead>
          <tr>
            <th>Stock</th>
            <th>Shares</th>
            <th>Avg Cost</th>
            <th>Current Price</th>
            <th>Market Value</th>
            <th>Gain/Loss</th>
            <th>Daily %</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => {
            const marketValue = stock.shares_owned * stock.market_price;
            const totalCost = stock.shares_owned * stock.cost_per_share;
            const gainLoss = marketValue - totalCost;
            const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;
            const dailyChange = prices[stock.symbol]?.change || stock.daily_change || 0;

            return (
              <tr key={stock.id}>
                <td data-label="Stock">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium">{stock.name}</div>
                      <div className="text-sm text-muted">{stock.symbol}</div>
                    </div>
                  </div>
                </td>
                <td data-label="Shares">
                  <input
                    type="number"
                    className="form-control"
                    style={{ width: '80px', maxWidth: '100%' }}
                    value={stock.shares_owned}
                    onChange={(e) => onUpdate(stock.id, 'shares_owned', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="1"
                  />
                </td>
                <td data-label="Avg Cost">
                  <input
                    type="number"
                    className="form-control"
                    style={{ width: '100px', maxWidth: '100%' }}
                    value={stock.cost_per_share}
                    onChange={(e) => onUpdate(stock.id, 'cost_per_share', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                  />
                </td>
                <td data-label="Current Price">${stock.market_price.toFixed(2)}</td>
                <td data-label="Market Value">${marketValue.toFixed(2)}</td>
                <td data-label="Gain/Loss">
                  <div className={gainLoss >= 0 ? 'text-success' : 'text-danger'}>
                    ${gainLoss.toFixed(2)} ({gainLossPercent.toFixed(2)}%)
                  </div>
                </td>
                <td data-label="Daily %">
                  <div className={`stock-change ${dailyChange >= 0 ? 'positive' : 'negative'}`}>
                    {dailyChange >= 0 ? '+' : ''}{dailyChange.toFixed(2)}%
                  </div>
                </td>
                <td data-label="Actions">
                  <button
                    onClick={() => onRemove(stock.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};