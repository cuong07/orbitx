# 🚀 OrbitX Trading Platform

<div align="center">
  <img src="public/1.png" alt="OrbitX Logo" width="220" height="220" />
  
  <h3>Professional cryptocurrency trading platform with real-time market data, advanced charting tools, and seamless trading experience.</h3>

  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](#license)
  [![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.x-646cff.svg)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38bdf8.svg)](https://tailwindcss.com/)
</div>

## ✨ Features

### 📊 **Trading Core**
- **Real-time Market Data** - Live price updates and market information
- **Advanced Order Types** - Market, Limit, Stop-Loss orders
- **Position Management** - Track open positions with P&L calculations
- **Order Book** - Real-time bid/ask data visualization
- **Trade History** - Complete trading activity records

### 📈 **Charting & Analysis**
- **Interactive Charts** - TradingView-style candlestick charts
- **Multiple Timeframes** - 1m, 5m, 15m, 1h, 4h, 1d intervals
- **Technical Indicators** - Built-in analysis tools
- **Real-time Updates** - Live price action on charts

### 💼 **Portfolio Management**
- **Balance Tracking** - Real-time balance updates
- **P&L Calculations** - Unrealized and realized profit/loss
- **Multi-asset Support** - Trade multiple cryptocurrency pairs
- **Risk Management** - Position sizing and risk controls

### 🎨 **User Experience**
- **Dark Mode Interface** - Professional trading aesthetic
- **Responsive Design** - Works on desktop and mobile
- **Smooth Animations** - Engaging user interactions
- **Loading States** - Thunder loader with 3s initialization

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with Hooks
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand for global state
- **Charts**: Custom charting solution with D3.js
- **Routing**: React Router for navigation
- **Icons**: Lucide React icons
- **Notifications**: Sonner for toast messages

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/cuong07/orbitx.git
cd orbitx

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=https://api.binance.com
VITE_WS_URL=wss://stream.binance.com:9443

# App Configuration
VITE_APP_NAME=OrbitX
VITE_APP_VERSION=1.0.0
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── Chart.jsx        # Trading chart component
│   ├── OrderBook.jsx    # Order book display
│   ├── OrderPanel.jsx   # Order placement form
│   ├── PositionsTable.jsx # Positions management
│   └── layouts/         # Layout components
├── stores/              # Zustand state management
│   └── useTradingStore.js # Main trading state
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── constants/           # App constants and enums
└── apis/               # API integration layer
```

## 🎯 Usage

### Basic Trading Flow

1. **Market Selection**: Choose cryptocurrency pairs from the market list
2. **Chart Analysis**: Analyze price movements using the interactive chart
3. **Order Placement**: Use the order panel to place buy/sell orders
4. **Position Monitoring**: Track open positions in the positions table
5. **Order Management**: Monitor and cancel orders in the order book

### Key Components

#### Trading Store
```javascript
// Access trading state and actions
const { 
  currentPrice, 
  positions, 
  placeOrder, 
  closePosition 
} = useTradingStore();
```

#### Order Placement
```javascript
// Place a market buy order
placeOrder({
  side: 'BUY',
  type: 'MARKET',
  quantity: '0.001',
  symbol: 'BTCUSDT'
});
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### Code Style

The project uses ESLint and Prettier for code formatting:

```bash
# Run linting
npm run lint

# Auto-fix issues
npm run lint:fix
```

## 🎨 Customization

### Theme Configuration

Modify `src/index.css` for custom styling:

```css
:root {
  --primary: 222.2 84% 4.9%;
  --primary-foreground: 210 40% 98%;
  /* Add your custom CSS variables */
}
```

### Adding New Trading Pairs

Update the market list in `src/constants/enum.js`:

```javascript
export const TRADING_PAIRS = [
  'BTCUSDT',
  'ETHUSDT',
  'ADAUSDT',
  // Add new pairs here
];
```

## 🌐 API Integration

The platform integrates with Binance API for market data:

- **REST API**: Market data, account information
- **WebSocket**: Real-time price feeds
- **Orders**: Simulated trading environment

## 📱 Responsive Design

OrbitX is fully responsive and optimized for:
- **Desktop**: Full trading interface
- **Tablet**: Adapted layout with collapsible panels  
- **Mobile**: Touch-optimized trading experience

## 🛡️ Security

- Client-side only implementation
- No real API keys stored
- Simulated trading environment
- Local storage for user preferences

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Binance API](https://binance-docs.github.io/apidocs/) for market data
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling system
- [Lucide](https://lucide.dev/) for icons

## 📞 Support

For support and questions:
- **Issues**: [GitHub Issues](https://github.com/cuong07/orbitx/issues)
- **Discussions**: [GitHub Discussions](https://github.com/cuong07/orbitx/discussions)

---

<div align="center">
  Made with ❤️ by the OrbitX Team
  
  [Website](https://orbitx.vercel.app) • [Documentation](#) • [Discord](#)
</div>
