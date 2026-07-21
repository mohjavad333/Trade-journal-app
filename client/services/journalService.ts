import { Symbol } from "./priceService";

export type TradeResult = "win" | "loss" | "pending" | "breakeven";

export interface JournalEntry {
  id: string;
  symbol: Symbol;
  type: "buy" | "sell";
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  lotSize: number;
  result: TradeResult;
  notes: string;
  strategy?: string;
  timestamp: number;
  exitPrice?: number;
  profit?: number;
}

export interface JournalStats {
  totalTrades: number;
  wins: number;
  losses: number;
  breakeven: number;
  pending: number;
  winRate: number;
  totalProfit: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
}

const STORAGE_KEY = "trading_journal_entries";

class JournalService {
  /**
   * Get all entries from localStorage
   */
  getEntries(): JournalEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading journal entries:", error);
      return [];
    }
  }

  /**
   * Add a new entry to the journal
   */
  addEntry(entry: Omit<JournalEntry, "id" | "timestamp">): JournalEntry {
    const entries = this.getEntries();
    const newEntry: JournalEntry = {
      ...entry,
      id: `trade_${Date.now()}`,
      timestamp: Date.now(),
    };

    entries.push(newEntry);
    this.saveEntries(entries);
    return newEntry;
  }

  /**
   * Update an existing entry
   */
  updateEntry(id: string, updates: Partial<JournalEntry>): JournalEntry | null {
    const entries = this.getEntries();
    const index = entries.findIndex((e) => e.id === id);

    if (index === -1) return null;

    const updatedEntry = { ...entries[index], ...updates };
    entries[index] = updatedEntry;
    this.saveEntries(entries);
    return updatedEntry;
  }

  /**
   * Delete an entry by ID
   */
  deleteEntry(id: string): boolean {
    const entries = this.getEntries();
    const filtered = entries.filter((e) => e.id !== id);

    if (filtered.length === entries.length) return false;

    this.saveEntries(filtered);
    return true;
  }

  /**
   * Delete all entries
   */
  deleteAllEntries(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Get statistics from entries
   */
  getStats(): JournalStats {
    const entries = this.getEntries();

    if (entries.length === 0) {
      return {
        totalTrades: 0,
        wins: 0,
        losses: 0,
        breakeven: 0,
        pending: 0,
        winRate: 0,
        totalProfit: 0,
        averageWin: 0,
        averageLoss: 0,
        profitFactor: 0,
      };
    }

    const wins = entries.filter((e) => e.result === "win").length;
    const losses = entries.filter((e) => e.result === "loss").length;
    const breakeven = entries.filter((e) => e.result === "breakeven").length;
    const pending = entries.filter((e) => e.result === "pending").length;

    // Calculate profits
    let totalProfit = 0;
    let totalWinProfit = 0;
    let totalLossProfit = 0;

    entries.forEach((entry) => {
      if (entry.profit !== undefined) {
        totalProfit += entry.profit;
        if (entry.result === "win") {
          totalWinProfit += entry.profit;
        } else if (entry.result === "loss") {
          totalLossProfit += Math.abs(entry.profit);
        }
      }
    });

    const completedTrades = wins + losses + breakeven;
    const winRate =
      completedTrades > 0 ? (wins / completedTrades) * 100 : 0;

    return {
      totalTrades: entries.length,
      wins,
      losses,
      breakeven,
      pending,
      winRate: Math.round(winRate * 100) / 100,
      totalProfit: Math.round(totalProfit * 100) / 100,
      averageWin: wins > 0 ? Math.round((totalWinProfit / wins) * 100) / 100 : 0,
      averageLoss:
        losses > 0 ? Math.round((totalLossProfit / losses) * 100) / 100 : 0,
      profitFactor:
        totalLossProfit > 0
          ? Math.round((totalWinProfit / totalLossProfit) * 100) / 100
          : 0,
    };
  }

  /**
   * Get entries filtered by symbol
   */
  getEntriesBySymbol(symbol: Symbol): JournalEntry[] {
    return this.getEntries().filter((e) => e.symbol === symbol);
  }

  /**
   * Get entries filtered by result
   */
  getEntriesByResult(result: TradeResult): JournalEntry[] {
    return this.getEntries().filter((e) => e.result === result);
  }

  /**
   * Get entries within a date range
   */
  getEntriesByDateRange(
    startDate: Date,
    endDate: Date
  ): JournalEntry[] {
    const start = startDate.getTime();
    const end = endDate.getTime();
    return this.getEntries().filter(
      (e) => e.timestamp >= start && e.timestamp <= end
    );
  }

  /**
   * Export entries as JSON
   */
  exportAsJSON(): string {
    return JSON.stringify(this.getEntries(), null, 2);
  }

  /**
   * Import entries from JSON
   */
  importFromJSON(jsonString: string): boolean {
    try {
      const entries = JSON.parse(jsonString) as JournalEntry[];
      this.saveEntries(entries);
      return true;
    } catch (error) {
      console.error("Error importing entries:", error);
      return false;
    }
  }

  /**
   * Save entries to localStorage
   */
  private saveEntries(entries: JournalEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error("Error saving entries:", error);
    }
  }
}

/**
 * Single instance of JournalService for use throughout the app
 */
export const journalService = new JournalService();
