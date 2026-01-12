# 📈 Stock Portfolio Tracker

A modern web application for managing and analyzing a personal stock portfolio. The app allows users to track holdings, calculate portfolio performance, and visualize gains and losses in real time.

## Overview

The Stock Portfolio Tracker is a React-based web application designed to help users manage their stock investments in a clear and structured way. Users can add, update, and remove stock positions while viewing calculated metrics such as market value and unrealized gains or losses.

This project demonstrates practical frontend development skills, state management, financial data handling, and modern web development practices.

## Features

### Core Functionality
- ✅ Add and manage stock positions with symbol, shares, cost basis, and market price
- ✅ Edit existing positions inline
- ✅ Automatic calculation of market value and unrealized gain/loss per stock
- ✅ Portfolio summary with total value and overall gain/loss
- ✅ Data persistence using localStorage
- ✅ Input validation and error handling

### Advanced Features
- ✅ Real-time stock price integration via Alpha Vantage API
- ✅ Auto-refresh market prices every 5 minutes
- ✅ Daily change percentage display
- ✅ Portfolio allocation pie chart
- ✅ Gain/loss over time line chart
- ✅ Best and worst performing stocks analysis
- ✅ Export portfolio data to CSV
- ✅ Clean, responsive UI with accessibility features

### Developer Experience
- ✅ Built with TypeScript for type safety
- ✅ Modern React with hooks and useReducer for state management
- ✅ Vite for fast development and optimized builds
- ✅ ESLint for code linting
- ✅ Vitest for unit testing
- ✅ CI/CD with GitHub Actions
- ✅ Ready for deployment on Vercel/Netlify

## Tech Stack

- **React 19** – Component-based UI development with hooks
- **TypeScript** – Type-safe JavaScript
- **Vite** – Fast build tool and dev server
- **Recharts** – Data visualization library
- **Bootstrap** – Responsive CSS framework
- **Alpha Vantage API** – Real-time stock market data
- **Papaparse** – CSV export functionality
- **Vitest** – Unit testing framework
- **ESLint** – Code linting

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stock-portfolio-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at:
👉 http://localhost:5173

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm run test
```

### Lint Code

```bash
npm run lint
```

## Project Structure

```
src/
├── App.tsx          # Main application component
├── main.tsx         # App entry point
├── types.ts         # TypeScript type definitions
├── App.css          # Component styles
├── index.css        # Global styles
└── assets/          # Static assets
```

## API Configuration

The app uses Alpha Vantage for real-time stock data. For full functionality:

1. Sign up for a free API key at [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Replace the `API_KEY` constant in `src/App.tsx` with your key

Note: The demo key has rate limits. For production use, obtain your own API key.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure build settings if needed

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Run linting: `npm run lint`
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Project Status

This project is actively maintained and evolving. Future enhancements may include:

- User authentication and multiple portfolios
- Advanced analytics and reporting
- Mobile app version
- Integration with more data providers

## Contact

Yoseph Berhane  
Fullstack Developer  
📧 contact@yoseph.dev  

🌐 https://yoseph.dev  

🐙 GitHub: https://github.com/yosephdev  

---
