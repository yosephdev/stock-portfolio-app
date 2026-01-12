import React, { useMemo } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, parseISO } from 'date-fns';

interface HistoricalData {
  date: string;
  value: number;
}

interface HistoricalChartProps {
  data: HistoricalData[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card" style={{ padding: 'var(--space-3)' }}>
        <p className="font-semibold">{label}</p>
        <p className="text-muted">
          Value: ${payload[0].value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

export const HistoricalChart: React.FC<HistoricalChartProps> = ({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      formattedDate: format(parseISO(item.date), 'MMM dd'),
      fullDate: format(parseISO(item.date), 'MMM dd, yyyy'),
    }));
  }, [data]);

  const calculatePerformance = useMemo(() => {
    if (processedData.length < 2) return { change: 0, percentage: 0 };
    
    const first = processedData[0].value;
    const last = processedData[processedData.length - 1].value;
    const change = last - first;
    const percentage = first > 0 ? (change / first) * 100 : 0;
    
    return { change, percentage };
  }, [processedData]);

  if (processedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ minHeight: '300px' }}>
        <p className="text-muted">No historical data available</p>
        <p className="text-sm text-muted">Data will be recorded as you use the app</p>
      </div>
    );
  }

  return (
    <div>
      {/* Performance Summary */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div className="flex items-center justify-between">
          <h4 className="card-title" style={{ marginBottom: 0 }}>Portfolio Performance</h4>
          <div className={`badge ${calculatePerformance.percentage >= 0 ? 'badge-success' : 'badge-danger'}`}>
            {calculatePerformance.percentage >= 0 ? '↗' : '↘'} {calculatePerformance.percentage.toFixed(2)}%
          </div>
        </div>
        <div className="text-sm text-muted" style={{ marginTop: 'var(--space-1)' }}>
          {processedData.length > 1 && (
            <span>
              {calculatePerformance.change >= 0 ? 'Gained' : 'Lost'} ${Math.abs(calculatePerformance.change).toFixed(2)} 
              since {format(parseISO(processedData[0].date), 'MMM dd, yyyy')}
            </span>
          )}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={processedData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis 
            dataKey="formattedDate" 
            stroke="var(--color-text-secondary)"
            fontSize={12}
          />
          <YAxis 
            stroke="var(--color-text-secondary)"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#8884d8" 
            strokeWidth={2}
            fill="url(#colorValue)" 
            name="Portfolio Value"
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#8884d8" 
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 5, fill: '#8884d8' }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Data Table */}
      <div style={{ marginTop: 'var(--space-4)' }}>
        <div className="table-responsive">
          <table className="portfolio-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Portfolio Value</th>
                <th>Daily Change</th>
              </tr>
            </thead>
            <tbody>
              {processedData.map((item, index) => {
                const prevValue = index > 0 ? processedData[index - 1].value : null;
                const dailyChange = prevValue !== null ? item.value - prevValue : null;
                const dailyChangePercent = prevValue !== null && prevValue > 0 ? (dailyChange! / prevValue) * 100 : null;

                return (
                  <tr key={item.date}>
                    <td>{item.fullDate}</td>
                    <td>
                      ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td>
                      {dailyChange !== null ? (
                        <span className={dailyChange >= 0 ? 'text-success' : 'text-danger'}>
                          {dailyChange >= 0 ? '+' : ''}{dailyChange.toFixed(2)} 
                          {dailyChangePercent !== null && (
                            <span style={{ marginLeft: 'var(--space-1)' }}>
                              ({dailyChangePercent >= 0 ? '+' : ''}{dailyChangePercent.toFixed(2)}%)
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              }).reverse()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};