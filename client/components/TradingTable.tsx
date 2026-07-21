import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

export default function TradingTable() {
  const trades = [
    {
      id: 1,
      symbol: "XAUUSD",
      type: "BUY",
      entryPrice: 2050.5,
      exitPrice: 2060.3,
      lot: 0.1,
      status: "بسته شده",
      profit: 97.8,
    },
    {
      id: 2,
      symbol: "EURUSD",
      type: "SELL",
      entryPrice: 1.1050,
      exitPrice: 1.1020,
      lot: 1.0,
      status: "بسته شده",
      profit: 300,
    },
  ];

  return (
    <div className="bg-white dark:bg-[hsl(var(--card))] dark-black:bg-[hsl(var(--card))] rounded-lg border border-gray-200 dark:border-gray-700 dark-black:border-gray-900 overflow-hidden">
      {/* Table Header with Search and Filters */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 dark-black:border-gray-900">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="جستجو در معاملات یا پادفشتهای..."
              className="bg-transparent flex-1 outline-none text-sm text-gray-600"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            فیلتر
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-3">
          <button className="px-3 py-1 bg-purple-100 text-primary rounded-full text-sm font-medium">
            همه
          </button>
          <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-full text-sm font-medium">
            سود
          </button>
          <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-full text-sm font-medium">
            ضرر
          </button>
          <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-full text-sm font-medium">
            باز
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">
                نماد
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">
                نوع
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">
                قیمت ورود
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">
                قیمت خروج
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">
                حجم
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">
                وضعیت
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">
                سود / ضرر
              </th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {trade.symbol}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      trade.type === "BUY"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {trade.type === "BUY" ? "خرید" : "فروش"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {trade.entryPrice}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {trade.exitPrice}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{trade.lot}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {trade.status}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <span className="text-green-600">+${trade.profit}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {trades.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">📊</div>
          <p className="text-gray-600">هنوز معامله ای ثبت نشده است</p>
        </div>
      )}
    </div>
  );
}
