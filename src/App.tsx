import { useEffect, useMemo } from 'react';
import { StockTable } from './components/StockTable';
import { PortfolioMetrics } from './components/PortfolioMetrics';
import { AddStockForm } from './components/AddStockForm';
import { AllocationChart } from './components/AllocationChart';
import { HistoricalChart } from './components/HistoricalChart';
import { usePortfolio } from './hooks/usePortfolio';
import { useStockData } from './hooks/useStockData';
import { useHistoricalData } from './hooks/useHistoricalData';
import { exportPortfolioToCSV, exportPortfolioToPDF } from './utils/exportUtils';
import type { Stock } from './types';
import './App.css';

const getInitialPortfolio = (): Stock[] => {
  const stored = localStorage.getItem('portfolio');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // If parsing fails, return default
    }
  }
  return [
    {
      id: '1',
      name: "Feetbook",
      symbol: "FB",
      shares_owned: 20,
      cost_per_share: 50,
      market_price: 130,
    },
    {
      id: '2',
      name: "Yamazon",
      symbol: "AMZN",
      shares_owned: 5,
      cost_per_share: 200,
      market_price: 500,
    },
    {
      id: '3',
      name: "Snoozechat",
      symbol: "SNAP",
      shares_owned: 100,
      cost_per_share: 20,
      market_price: 3,
    },
  ];
};

function App() {
  const initialPortfolio = useMemo(() => getInitialPortfolio(), []);
  const { state, addStock, updateStock, removeStock } = usePortfolio(initialPortfolio);
  
  // Memoize symbols to prevent unnecessary re-renders
  const symbols = useMemo(() => state.portfolio.map(stock => stock.symbol), [state.portfolio]);
  const { prices, loading } = useStockData(symbols);
  
  const totalMarketValue = useMemo(() => 
    state.portfolio.reduce((sum, stock) => 
      sum + (stock.shares_owned * stock.market_price), 0
    ), [state.portfolio]
  );
  
  const historicalData = useHistoricalData(totalMarketValue);

  // Persist portfolio to localStorage
  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(state.portfolio));
  }, [state.portfolio]);

  // Update stock prices when new price data arrives
  useEffect(() => {
    if (Object.keys(prices).length === 0) return;
    
    const updates: Array<{ id: string; price: number; change: number }> = [];
    
    state.portfolio.forEach(stock => {
      const priceData = prices[stock.symbol];
      if (priceData && Math.abs(priceData.price - stock.market_price) > 0.01) {
        updates.push({
          id: stock.id,
          price: priceData.price,
          change: priceData.change,
        });
      }
    });

    if (updates.length > 0) {
      updates.forEach(update => {
        updateStock(update.id, { 
          market_price: update.price, 
          daily_change: update.change,
          last_updated: new Date().toISOString()
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices]); // Only update when prices change, not when portfolio changes

  const handleExportCSV = () => {
    exportPortfolioToCSV(state.portfolio);
  };

  const handleExportPDF = async () => {
    await exportPortfolioToPDF(state.portfolio, totalMarketValue);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="text-gradient">Stock Portfolio Tracker</h1>
        <p>Track your investments in real-time</p>
      </header>

      <main className="app-main">
        <PortfolioMetrics portfolio={state.portfolio} prices={prices} />

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Your Holdings</h2>
            <div className="btn-group">
              <button
                onClick={handleExportCSV}
                className="btn btn-primary"
              >
                Export CSV
              </button>
              <button
                onClick={handleExportPDF}
                className="btn btn-danger"
              >
                Export PDF
              </button>
            </div>
          </div>
          <StockTable
            stocks={state.portfolio}
             onUpdate={(id, field, value) => updateStock(id, { [field]: value })}
            onRemove={removeStock}
            prices={prices}
          />
        </div>

        <div className="grid grid-cols-2">
          <div className="card">
            <h3 className="card-title">Portfolio Allocation</h3>
            <AllocationChart portfolio={state.portfolio} />
          </div>
          
          <div className="card">
            <h3 className="card-title">Performance History</h3>
            <HistoricalChart data={historicalData} />
          </div>
        </div>

        <div className="card">
          <AddStockForm
            onSubmit={addStock}
            errors={state.errors}
            loading={state.loading}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Data provided by Alpha Vantage • {loading && 'Updating prices...'}
        </p>
      </footer>
    </div>
  );
}

export default App;