import { describe, it, expect, vi } from 'vitest';
import { exportPortfolioToCSV, exportPortfolioToPDF } from './exportUtils';
import type { Stock } from '../types';

// Mock Papa (CSV library)
vi.mock('papaparse', () => ({
  default: {
    unparse: vi.fn(() => 'mock,csv,data')
  }
}));

// Mock jsPDF and autoTable
vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(function() {
    return {
      setFontSize: vi.fn(),
      text: vi.fn(),
      setTextColor: vi.fn(),
      save: vi.fn(),
      lastAutoTable: { finalY: 100 }
    };
  })
}));

vi.mock('jspdf-autotable', () => ({
  default: vi.fn()
}));

// Mock URL and document
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: vi.fn(() => 'mock-url'),
    revokeObjectURL: vi.fn()
  },
  writable: true
});

Object.defineProperty(document, 'createElement', {
  value: vi.fn(() => ({
    setAttribute: vi.fn(),
    click: vi.fn(),
    style: {}
  })),
  writable: true
});

Object.defineProperty(document, 'body', {
  value: {
    appendChild: vi.fn(),
    removeChild: vi.fn()
  },
  writable: true
});

describe('exportUtils', () => {
  const mockStocks: Stock[] = [
    {
      id: '1',
      name: 'Apple Inc.',
      symbol: 'AAPL',
      shares_owned: 10,
      cost_per_share: 150,
      market_price: 180,
      daily_change: 2.5,
      last_updated: '2024-01-12T10:00:00Z'
    }
  ];

  describe('exportPortfolioToCSV', () => {
    it('should create and download a CSV file', () => {
      // Mock Date to ensure consistent filename
      const mockDate = new Date('2024-01-12');
      vi.setSystemTime(mockDate);

      exportPortfolioToCSV(mockStocks);

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(URL.createObjectURL).toHaveBeenCalled();

      vi.useRealTimers();
    });

    it('should handle empty portfolio', () => {
      exportPortfolioToCSV([]);

      expect(document.createElement).toHaveBeenCalledWith('a');
    });
  });

  describe('exportPortfolioToPDF', () => {
    it('should create and download a PDF file', async () => {
      // Mock Date to ensure consistent filename
      const mockDate = new Date('2024-01-12');
      vi.setSystemTime(mockDate);

      const totalValue = 1800; // 10 shares * $180

      await exportPortfolioToPDF(mockStocks, totalValue);

      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(URL.createObjectURL).toHaveBeenCalled();

      vi.useRealTimers();
    });

    it('should handle empty portfolio', async () => {
      await exportPortfolioToPDF([], 0);

      expect(document.createElement).toHaveBeenCalledWith('a');
    });
  });
});