import React, { useState } from 'react';
import type { Stock } from '../types';

interface AddStockFormProps {
  onSubmit: (stock: Omit<Stock, 'id'>) => void;
  errors: Record<string, string>;
  loading?: boolean;
}

export const AddStockForm: React.FC<AddStockFormProps> = ({ onSubmit, errors, loading = false }) => {
  const [formData, setFormData] = useState<Omit<Stock, 'id'>>({
    name: '',
    symbol: '',
    shares_owned: 0,
    cost_per_share: 0,
    market_price: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' || name === 'symbol' ? value : parseFloat(value) || 0,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form after submission
    setFormData({
      name: '',
      symbol: '',
      shares_owned: 0,
      cost_per_share: 0,
      market_price: 0,
    });
  };

  return (
    <div className="card">
      <h2 className="card-title">Add New Stock</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Stock Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="e.g., Apple Inc."
              required
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="symbol" className="form-label">
              Stock Symbol *
            </label>
            <input
              type="text"
              id="symbol"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              className={`form-control ${errors.symbol ? 'is-invalid' : ''}`}
              placeholder="e.g., AAPL"
              required
            />
            {errors.symbol && (
              <div className="invalid-feedback">{errors.symbol}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="form-group">
            <label htmlFor="shares_owned" className="form-label">
              Shares Owned *
            </label>
            <input
              type="number"
              id="shares_owned"
              name="shares_owned"
              value={formData.shares_owned || ''}
              onChange={handleChange}
              min="0"
              step="1"
              className={`form-control ${errors.shares_owned ? 'is-invalid' : ''}`}
              placeholder="0"
              required
            />
            {errors.shares_owned && (
              <div className="invalid-feedback">{errors.shares_owned}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="cost_per_share" className="form-label">
              Cost per Share ($) *
            </label>
            <input
              type="number"
              id="cost_per_share"
              name="cost_per_share"
              value={formData.cost_per_share || ''}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`form-control ${errors.cost_per_share ? 'is-invalid' : ''}`}
              placeholder="0.00"
              required
            />
            {errors.cost_per_share && (
              <div className="invalid-feedback">{errors.cost_per_share}</div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="market_price" className="form-label">
            Current Market Price ($)
          </label>
          <input
            type="number"
            id="market_price"
            name="market_price"
            value={formData.market_price || ''}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`form-control ${errors.market_price ? 'is-invalid' : ''}`}
            placeholder="0.00 (leave blank to auto-fetch)"
          />
          {errors.market_price && (
            <div className="invalid-feedback">{errors.market_price}</div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Adding...' : 'Add Stock to Portfolio'}
          </button>
        </div>
      </form>
    </div>
  );
};