/**
 * Price Service
 * Handles real-time price data and OHLC (Open, High, Low, Close) data
 * for trading symbols: XAUUSD, BTCUSDT, EURUSD
 */

export interface OHLC {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TickerData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  timestamp: number;
}

export interface Timeframe {
  interval: "1m" | "5m" | "15m";
  candles: OHLC[];
}

export type Symbol = "XAUUSD" | "BTCUSDT" | "EURUSD" | "DJI" | "IXIC" | "GBPUSD";

const SUPPORTED_SYMBOLS: Symbol[] = ["XAUUSD", "BTCUSDT", "EURUSD", "DJI", "IXIC", "GBPUSD"];
const TIMEFRAMES = ["1m", "5m", "15m"] as const;

/**
 * Mock data generator for development
 * In production, this would connect to real APIs like Binance, OKX, TwelveData
 */
export function generateMockOHLC(
  symbol: Symbol,
  timeframe: "1m" | "5m" | "15m",
  count: number = 100
): OHLC[] {
  const candles: OHLC[] = [];
  let basePrice = getBasePrice(symbol);
  const now = Math.floor(Date.now() / 1000);
  const interval = getIntervalSeconds(timeframe);

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = now - i * interval;
    const volatility = 0.002; // 0.2% volatility per candle

    const open = basePrice;
    const change = (Math.random() - 0.5) * 2 * volatility * basePrice;
    const close = basePrice + change;
    const high = Math.max(open, close) + Math.random() * volatility * basePrice;
    const low = Math.min(open, close) - Math.random() * volatility * basePrice;

    candles.push({
      timestamp,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.floor(Math.random() * 10000000),
    });

    basePrice = close;
  }

  return candles;
}

/**
 * Get base price for a symbol
 */
function getBasePrice(symbol: Symbol): number {
  const prices: Record<Symbol, number> = {
    XAUUSD: 2150.45,
    BTCUSDT: 45230.0,
    EURUSD: 1.0895,
    DJI: 39000.0,
    IXIC: 17500.0,
    GBPUSD: 1.2745,
  };
  return prices[symbol];
}

/**
 * Convert timeframe to seconds
 */
function getIntervalSeconds(timeframe: "1m" | "5m" | "15m"): number {
  const intervals: Record<string, number> = {
    "1m": 60,
    "5m": 300,
    "15m": 900,
  };
  return intervals[timeframe];
}

/**
 * Generate mock ticker data
 */
export function generateMockTicker(symbol: Symbol): TickerData {
  const basePrice = getBasePrice(symbol);
  const change = (Math.random() - 0.5) * basePrice * 0.05;

  return {
    symbol,
    price: Math.round((basePrice + change) * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round((change / basePrice) * 10000) / 100,
    high24h: Math.round(basePrice * 1.02 * 100) / 100,
    low24h: Math.round(basePrice * 0.98 * 100) / 100,
    volume: Math.floor(Math.random() * 100000000),
    timestamp: Date.now(),
  };
}

/**
 * Price WebSocket Manager
 * Handles real-time WebSocket connections for price data
 */
export class PriceWebSocketManager {
  private connections: Map<Symbol, WebSocket | null> = new Map();
  private listeners: Map<Symbol, Set<(data: TickerData) => void>> = new Map();
  private reconnectAttempts: Map<Symbol, number> = new Map();
  private maxReconnectAttempts = 5;

  constructor() {
    // Initialize maps for each symbol
    SUPPORTED_SYMBOLS.forEach((symbol) => {
      this.connections.set(symbol, null);
      this.listeners.set(symbol, new Set());
      this.reconnectAttempts.set(symbol, 0);
    });
  }

  /**
   * Subscribe to price updates for a symbol
   */
  subscribe(
    symbol: Symbol,
    callback: (data: TickerData) => void
  ): () => void {
    const listeners = this.listeners.get(symbol);
    if (listeners) {
      listeners.add(callback);
    }

    // For development, simulate real-time updates
    const interval = setInterval(() => {
      const tickerData = generateMockTicker(symbol);
      if (listeners) {
        listeners.forEach((listener) => listener(tickerData));
      }
    }, 1000); // Update every second

    // Return unsubscribe function
    return () => {
      clearInterval(interval);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  /**
   * Connect to WebSocket (placeholder for future real implementation)
   */
  connect(symbol: Symbol): Promise<void> {
    return new Promise((resolve) => {
      // Simulate connection delay
      setTimeout(() => {
        resolve();
      }, 100);
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(symbol: Symbol): void {
    const connection = this.connections.get(symbol);
    if (connection) {
      connection.close();
      this.connections.set(symbol, null);
    }
  }

  /**
   * Disconnect all connections
   */
  disconnectAll(): void {
    SUPPORTED_SYMBOLS.forEach((symbol) => {
      this.disconnect(symbol);
    });
  }
}

/**
 * Single instance of PriceWebSocketManager for use throughout the app
 */
export const priceWebSocketManager = new PriceWebSocketManager();
