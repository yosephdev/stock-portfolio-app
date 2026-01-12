import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { Stock } from '../types';

interface AllocationChartProps {
  portfolio: Stock[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      value: number;
      percentage: number;
    };
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="card" style={{ padding: 'var(--space-3)' }}>
        <p className="font-semibold">{data.name}</p>
        <p className="text-muted">Value: ${data.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p className="text-muted">Allocation: {data.percentage.toFixed(2)}%</p>
      </div>
    );
  }
  return null;
};

const COLORS = [ 
  '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1',
  '#A4DE6C', '#D0ED57', '#FFC0CB', '#BA55D3'
];

export const AllocationChart: React.FC<AllocationChartProps> = ({ portfolio }) => {
  const chartData = useMemo(() => {
    return portfolio.map(stock => {
      const marketValue = stock.shares_owned * stock.market_price;
      return {
        name: `${stock.name} (${stock.symbol})`,
        value: marketValue,
        percentage: 0, // Will be calculated below
      };
    });
  }, [portfolio]);

  // Calculate total value for percentages
  const totalValue = useMemo(() => 
    chartData.reduce((sum, item) => sum + item.value, 0), 
    [chartData]
  );

  // Add percentages to data
  const dataWithPercentages = useMemo(() => 
    chartData.map(item => ({
      ...item,
      percentage: totalValue > 0 ? (item.value / totalValue) * 100 : 0,
    })), 
    [chartData, totalValue]
  );

  if (portfolio.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: '300px' }}>
        <p className="text-muted">No stocks in portfolio</p>
        <p className="text-sm text-muted">Add stocks to see allocation chart</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={dataWithPercentages}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => {
              const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
              const displayName = name?.split('(')[1]?.replace(')', '') || name || 'Unknown';
              return `${displayName}: ${percentage.toFixed(1)}%`;
            }}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {dataWithPercentages.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Allocation Details Table */}
      <div style={{ marginTop: 'var(--space-4)' }}>
        <div className="table-responsive allocation-table">
          <table className="portfolio-table">
            <thead>
              <tr>
                <th>Stock</th>
                <th>Value</th>
                <th>Allocation</th>
                <th>Color</th>
              </tr>
            </thead>
            <tbody>
              {dataWithPercentages.map((item, index) => (
                <tr key={index}>
                  <td data-label="Stock">{item.name}</td>
                  <td data-label="Value">
                    ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td data-label="Allocation">
                    <div className="flex items-center">
                      <div style={{ 
                        width: '120px', 
                        height: '8px', 
                        backgroundColor: 'var(--color-gray-200)',
                        borderRadius: 'var(--radius-full)',
                        marginRight: 'var(--space-3)'
                      }}>
                        <div 
                          style={{ 
                            width: `${item.percentage}%`, 
                            height: '100%',
                            backgroundColor: COLORS[index % COLORS.length],
                            borderRadius: 'var(--radius-full)'
                          }}
                        />
                      </div>
                      <span>{item.percentage.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td data-label="Color">
                    <div 
                      style={{ 
                        width: '16px', 
                        height: '16px', 
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: COLORS[index % COLORS.length] 
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};