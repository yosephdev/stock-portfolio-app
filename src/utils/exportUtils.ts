import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Stock } from '../types';

export const exportPortfolioToCSV = (portfolio: Stock[]) => {
  const data = portfolio.map(stock => ({
    'Stock Name': stock.name,
    'Symbol': stock.symbol,
    'Shares Owned': stock.shares_owned,
    'Cost per Share': stock.cost_per_share.toFixed(2),
    'Market Price': stock.market_price.toFixed(2),
    'Market Value': (stock.shares_owned * stock.market_price).toFixed(2),
    'Total Cost': (stock.shares_owned * stock.cost_per_share).toFixed(2),
    'Unrealized Gain/Loss': (stock.shares_owned * (stock.market_price - stock.cost_per_share)).toFixed(2),
    'Daily Change %': stock.daily_change?.toFixed(2) || 'N/A',
    'Last Updated': stock.last_updated ? new Date(stock.last_updated).toLocaleString() : 'N/A'
  }));

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `portfolio_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportPortfolioToPDF = async (portfolio: Stock[], totalMarketValue: number) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Portfolio Report', 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${date}`, 14, 30);
  doc.text(`Total Portfolio Value: $${totalMarketValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 14, 37);
  
  // Prepare table data
  const tableData = portfolio.map(stock => {
    const marketValue = stock.shares_owned * stock.market_price;
    const totalCost = stock.shares_owned * stock.cost_per_share;
    const gainLoss = marketValue - totalCost;
    const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost) * 100 : 0;
    
    return [
      stock.name,
      stock.symbol,
      stock.shares_owned.toString(),
      `$${stock.cost_per_share.toFixed(2)}`,
      `$${stock.market_price.toFixed(2)}`,
      `$${marketValue.toFixed(2)}`,
      `${gainLoss >= 0 ? '+' : ''}$${gainLoss.toFixed(2)} (${gainLossPercent.toFixed(2)}%)`,
      stock.daily_change ? `${stock.daily_change.toFixed(2)}%` : 'N/A'
    ];
  });

  // Add table
  autoTable(doc, {
    head: [['Stock', 'Symbol', 'Shares', 'Avg Cost', 'Price', 'Value', 'Gain/Loss', 'Daily %']],
    body: tableData,
    startY: 45,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 20 },
      2: { cellWidth: 15 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20 },
      5: { cellWidth: 25 },
      6: { cellWidth: 35 },
      7: { cellWidth: 20 }
    }
  });

  // Calculate summary statistics
  const totalCost = portfolio.reduce((sum, stock) => sum + (stock.shares_owned * stock.cost_per_share), 0);
  const totalGainLoss = totalMarketValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
  
  const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 100;
  
  // Add summary
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Portfolio Summary', 14, finalY + 15);
  
  doc.setFontSize(10);
  doc.text(`Total Investments: $${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 14, finalY + 25);
  doc.text(`Total Current Value: $${totalMarketValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 14, finalY + 32);
  
  const gainLossColor = totalGainLoss >= 0 ? [46, 204, 113] : [231, 76, 60];
  doc.setTextColor(gainLossColor[0], gainLossColor[1], gainLossColor[2]);
  doc.text(
    `Total Gain/Loss: ${totalGainLoss >= 0 ? '+' : ''}$${totalGainLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${totalGainLossPercent.toFixed(2)}%)`,
    14,
    finalY + 39
  );

  // Save the PDF
  doc.save(`portfolio_report_${new Date().toISOString().split('T')[0]}.pdf`);
};