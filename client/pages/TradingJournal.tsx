import { useState, useMemo } from "react";
import { JournalEntry, journalService, TradeResult } from "@/services/journalService";
import { Symbol } from "@/services/priceService";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Clock,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreVertical,
  Calendar,
  Layers,
  FileText,
  Target,
  ArrowUpDown,
  Coins,
  ShieldAlert,
  Trophy,
  Activity,
  MessageSquare,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function TradingJournal() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>(
    journalService.getEntries()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterResult, setFilterResult] = useState<TradeResult | "all">("all");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Date filter state
  const [dateFromString, setDateFromString] = useState("");
  const [dateToString, setDateToString] = useState("");

  // Helper functions for date presets
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getStartOfWeek = () => {
    const now = new Date();
    const first = now.getDate() - now.getDay();
    const startOfWeek = new Date(now.setDate(first));
    return startOfWeek.toISOString().split("T")[0];
  };

  const getStartOfMonth = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return startOfMonth.toISOString().split("T")[0];
  };

  const setPresetDates = (preset: "today" | "week" | "month" | "all") => {
    const today = getToday();
    switch (preset) {
      case "today":
        setDateFromString(today);
        setDateToString(today);
        break;
      case "week":
        setDateFromString(getStartOfWeek());
        setDateToString(today);
        break;
      case "month":
        setDateFromString(getStartOfMonth());
        setDateToString(today);
        break;
      case "all":
        setDateFromString("");
        setDateToString("");
        break;
    }
  };

  const isDateInRange = (timestamp: number): boolean => {
    if (!dateFromString && !dateToString) return true;

    const tradeDate = new Date(timestamp).toISOString().split("T")[0];

    if (dateFromString && tradeDate < dateFromString) return false;
    if (dateToString && tradeDate > dateToString) return false;

    return true;
  };

  // Form State
  const [formData, setFormData] = useState<Partial<JournalEntry>>({
    symbol: "XAUUSD",
    type: "buy",
    entryPrice: 0,
    stopLoss: 0,
    takeProfit: 0,
    lotSize: 0.1,
    result: "pending",
    notes: "",
    strategy: "SMC",
  });

  const stats = useMemo(() => journalService.getStats(), [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      const matchesSearch =
        e.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.notes.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterResult === "all" || e.result === filterResult;
      const matchesDate = isDateInRange(e.timestamp);
      return matchesSearch && matchesFilter && matchesDate;
    });
  }, [entries, searchTerm, filterResult, dateFromString, dateToString]);

  const resetForm = () => {
    setFormData({
      symbol: "XAUUSD",
      type: "buy",
      entryPrice: 0,
      stopLoss: 0,
      takeProfit: 0,
      lotSize: 0.1,
      result: "pending",
      notes: "",
      strategy: "SMC",
    });
    setEditingId(null);
  };

  const handleAddEntry = () => {
    try {
      if (editingId) {
        // Update existing entry
        journalService.updateEntry(editingId, formData as any);
        toast({
          title: "ترید با موفقیت به‌روز شد",
          description: "تغییرات در ژورنال شخصی شما ذخیره گردید.",
        });
      } else {
        // Add new entry
        journalService.addEntry(formData as any);
        toast({
          title: "ترید با موفقیت ثبت شد",
          description: "اطلاعات در ژورنال شخصی شما ذخیره گردید.",
        });
      }
      setEntries(journalService.getEntries());
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "خطا در ثبت اطلاعات",
        description: "لطفاً تمامی فیلدها را به درستی پر کنید.",
      });
    }
  };

  const handleEdit = (trade: JournalEntry) => {
    setFormData({
      symbol: trade.symbol,
      type: trade.type,
      entryPrice: trade.entryPrice,
      stopLoss: trade.stopLoss,
      takeProfit: trade.takeProfit,
      lotSize: trade.lotSize,
      result: trade.result,
      notes: trade.notes,
      strategy: trade.strategy,
    });
    setEditingId(trade.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("آیا از حذف این رکورد مطمئن هستید؟")) {
      journalService.deleteEntry(id);
      setEntries(journalService.getEntries());
      toast({
        title: "ترید حذف شد",
        description: "رکورد مورد نظر از دیتابیس محلی پاک گردید.",
      });
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gray-50 dark:bg-[hsl(var(--background))] dark-black:bg-black transition-colors"
    >
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white dark-black:text-white">
                ژورنال معاملاتی
              </h1>
              <p className="text-gray-500 dark:text-gray-400 dark-black:text-gray-500 text-sm mt-1">
                Trading Log & Journaling
              </p>
            </div>
          </div>

          <Dialog
            open={isModalOpen}
            onOpenChange={(open) => {
              setIsModalOpen(open);
              if (!open) {
                resetForm();
              }
            }}
          >
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95">
                <Plus className="w-5 h-5" />
                ثبت ترید جدید
              </button>
            </DialogTrigger>
            <DialogContent
              className="w-[calc(100vw-1rem)] max-h-[90vh] overflow-y-auto sm:max-w-[550px] bg-white dark:bg-gray-900 dark-black:bg-black border border-gray-200 dark:border-gray-800"
              dir="rtl"
            >
              <DialogHeader className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-2">
                <DialogTitle className="text-xl sm:text-2xl font-black text-right text-indigo-700 dark:text-indigo-400">
                  {editingId ? "ویرایش معامله" : "جزئیات معامله جدید"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-indigo-500" />
                    نماد
                  </Label>
                  <Select
                    value={formData.symbol}
                    onValueChange={(v) =>
                      setFormData({ ...formData, symbol: v as Symbol })
                    }
                  >
                    <SelectTrigger className="bg-gray-50 dark:bg-gray-800 dark-black:bg-gray-900 border-gray-200 dark:border-gray-700 h-11 text-gray-900 dark:text-white font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 dark-black:bg-gray-900 border-gray-200 dark:border-gray-700 dark-black:border-gray-800">
                      <SelectItem value="XAUUSD">XAUUSD - طلا</SelectItem>
                      <SelectItem value="BTCUSDT">BTCUSDT - بیت‌کوین</SelectItem>
                      <SelectItem value="EURUSD">EURUSD - یورو/دلار</SelectItem>
                      <SelectItem value="DJI">DJI - داو جونز</SelectItem>
                      <SelectItem value="IXIC">IXIC - نزدک</SelectItem>
                      <SelectItem value="GBPUSD">GBPUSD - پوند/دلار</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-1">
                    <ArrowUpDown className="w-4 h-4 text-indigo-500" />
                    نوع پوزیشن
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) =>
                      setFormData({ ...formData, type: v as any })
                    }
                  >
                    <SelectTrigger className="bg-gray-50 dark:bg-gray-800 dark-black:bg-gray-900 border-gray-200 dark:border-gray-700 h-11 text-gray-900 dark:text-white font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 dark-black:bg-gray-900 border-gray-200 dark:border-gray-700 dark-black:border-gray-800">
                      <SelectItem value="buy">BUY (خرید)</SelectItem>
                      <SelectItem value="sell">SELL (فروش)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-1">
                    <Coins className="w-4 h-4 text-indigo-500" />
                    قیمت ورود
                  </Label>
                  <Input
                    type="number"
                    placeholder="1850.25"
                    value={formData.entryPrice ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        entryPrice: e.target.value === "" ? 0 : parseFloat(e.target.value),
                      })
                    }
                    className="bg-gray-50 dark:bg-gray-800 dark-black:bg-gray-900 border-gray-200 dark:border-gray-700 h-11 text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-1">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    حجم (Lot)
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.lotSize ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lotSize: e.target.value === "" ? 0 : parseFloat(e.target.value),
                      })
                    }
                    className="bg-gray-50 dark:bg-gray-800 dark-black:bg-gray-900 border-gray-200 dark:border-gray-700 h-11 text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-1">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    حد ضرر (SL)
                  </Label>
                  <Input
                    type="number"
                    value={formData.stopLoss ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stopLoss: e.target.value === "" ? 0 : parseFloat(e.target.value),
                      })
                    }
                    className="bg-gray-50 dark:bg-gray-800 dark-black:bg-gray-900 border-gray-200 dark:border-gray-700 h-11 text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-green-500" />
                    حد سود (TP)
                  </Label>
                  <Input
                    type="number"
                    value={formData.takeProfit ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        takeProfit: e.target.value === "" ? 0 : parseFloat(e.target.value),
                      })
                    }
                    className="bg-gray-50 dark:bg-gray-800 dark-black:bg-gray-900 border-gray-200 dark:border-gray-700 h-11 text-gray-900 dark:text-white font-bold placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
                <div className="col-span-1 sm:col-span-2 space-y-2">
                  <Label className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    وضعیت ترید
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["pending", "win", "loss", "breakeven"].map((res) => (
                      <button
                        key={res}
                        onClick={() =>
                          setFormData({ ...formData, result: res as TradeResult })
                        }
                        className={`py-2.5 px-1 text-[11px] font-bold rounded-xl border transition-all ${
                          formData.result === res
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none"
                            : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {res === "pending"
                          ? "باز"
                          : res === "win"
                            ? "سود"
                            : res === "loss"
                              ? "ضرر"
                              : "سر‌به‌سر"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-span-1 sm:col-span-2 space-y-2">
                  <Label className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                    یادداشت‌های تحلیلی
                  </Label>
                  <Textarea
                    placeholder="چرا وارد این ترید شدید؟ ستاپ SMC؟ CHoCH؟ ..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="h-28 bg-gray-50 dark:bg-gray-800 dark-black:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddEntry}
                className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold py-6 text-lg text-white"
              >
                {editingId ? "بروز‌رسانی ترید" : "ذخیره در ژورنال"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-[hsl(var(--card))] dark-black:bg-black/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                <Layers className="w-6 h-6" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-none">
                Total
              </Badge>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold mb-1">
              تعداد کل تریدها
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white dark-black:text-white">
              {stats.totalTrades}
            </h4>
          </div>

          <div className="bg-white dark:bg-[hsl(var(--card))] dark-black:bg-black/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-none">
                Win Rate
              </Badge>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold mb-1">
              نسبت پیروزی
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white dark-black:text-white">
              %{stats.winRate.toFixed(1)}
            </h4>
          </div>

          <div className="bg-white dark:bg-[hsl(var(--card))] dark-black:bg-black/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400">
                <TrendingDown className="w-6 h-6" />
              </div>
              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-none">
                Losses
              </Badge>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold mb-1">
              تعداد ضررها
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white dark-black:text-white">
              {stats.losses}
            </h4>
          </div>

          <div className="bg-white dark:bg-[hsl(var(--card))] dark-black:bg-black/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-none">
                Efficiency
              </Badge>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold mb-1">
              تعداد پیروزی‌ها
            </p>
            <h4 className="text-3xl font-black text-gray-900 dark:text-white dark-black:text-white">
              {stats.wins}
            </h4>
          </div>
        </div>

        {/* Filters & Content */}
        <div className="bg-white dark:bg-[hsl(var(--card))] dark-black:bg-black/40 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-50 dark:border-gray-800 space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجو در نمادها یا یادداشت‌ها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 bg-gray-50 dark:bg-gray-800 dark-black:bg-gray-900 border border-transparent focus:border-indigo-500 rounded-xl text-sm transition-all outline-none text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-gray-400 hidden md:block" />
                <div className="flex gap-2 flex-wrap">
                  {["all", "win", "loss", "pending"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilterResult(f as any)}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                        filterResult === f
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                          : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {f === "all"
                        ? "همه"
                        : f === "win"
                          ? "سود"
                          : f === "loss"
                            ? "ضرر"
                            : "باز"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Date Filter */}
            <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">فیلتر بر اساس تاریخ</p>

              {/* Date Presets */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setPresetDates("all")}
                  className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                    !dateFromString && !dateToString
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                      : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  همه
                </button>
                <button
                  onClick={() => setPresetDates("today")}
                  className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                    dateFromString === getToday() && dateToString === getToday()
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                      : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  امروز
                </button>
                <button
                  onClick={() => setPresetDates("week")}
                  className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                    dateFromString === getStartOfWeek() && dateToString === getToday()
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                      : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  این هفته
                </button>
                <button
                  onClick={() => setPresetDates("month")}
                  className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                    dateFromString === getStartOfMonth() && dateToString === getToday()
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                      : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  این ماه
                </button>
              </div>

              {/* Custom Date Inputs */}
              <div className="flex gap-2 flex-col sm:flex-row">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    از تاریخ
                  </label>
                  <input
                    type="date"
                    value={dateFromString}
                    onChange={(e) => setDateFromString(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 dark-black:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    تا تاریخ
                  </label>
                  <input
                    type="date"
                    value={dateToString}
                    onChange={(e) => setDateToString(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 dark-black:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* List Content */}
          {/* Table for desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/30 text-gray-500 dark:text-gray-400 text-[11px] uppercase tracking-wider font-black">
                  <th className="px-6 py-4">نماد / زمان</th>
                  <th className="px-6 py-4 text-center">نوع</th>
                  <th className="px-6 py-4">ورود / حجم</th>
                  <th className="px-6 py-4">حد ضرر / سود</th>
                  <th className="px-6 py-4">وضعیت</th>
                  <th className="px-6 py-4">یادداشت</th>
                  <th className="px-6 py-4 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filteredEntries.map((trade) => (
                  <tr
                    key={trade.id}
                    className="hover:bg-gray-50/30 dark:hover:bg-gray-900/20 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center text-indigo-600 font-black text-xs">
                          {trade.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 dark:text-gray-100 text-sm">
                            {trade.symbol}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                            <Clock className="w-3 h-3" />
                            {new Date(trade.timestamp).toLocaleDateString(
                              "fa-IR"
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <Badge
                        className={`font-black uppercase text-[10px] ${
                          trade.type === "buy"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                        }`}
                      >
                        {trade.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-mono font-bold text-gray-900 dark:text-gray-100 text-sm">
                        {trade.entryPrice}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        Lot: {trade.lotSize}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-red-500 font-bold">
                          SL: {trade.stopLoss}
                        </span>
                        <span className="text-[10px] text-green-500 font-bold">
                          TP: {trade.takeProfit}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5">
                        {trade.result === "win" && (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        )}
                        {trade.result === "loss" && (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        {trade.result === "pending" && (
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                        )}
                        <span
                          className={`text-xs font-bold ${
                            trade.result === "win"
                              ? "text-green-600"
                              : trade.result === "loss"
                                ? "text-red-600"
                                : trade.result === "breakeven"
                                  ? "text-indigo-600"
                                  : "text-orange-600"
                          }`}
                        >
                          {trade.result === "win"
                            ? "سود"
                            : trade.result === "loss"
                              ? "ضرر"
                              : trade.result === "breakeven"
                                ? "سر‌به‌سر"
                                : "در جریان"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 max-w-[200px]">
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {trade.notes || "---"}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleEdit(trade)}
                          aria-label="ویرایش معامله"
                          className="h-10 w-10 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(trade.id)}
                          aria-label="حذف معامله"
                          className="h-10 w-10 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredEntries.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center max-w-xs mx-auto">
                        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-6">
                          <FileText className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                        </div>
                        <h5 className="text-lg font-black text-gray-900 dark:text-white mb-2">
                          ژورنال شما خالی است
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                          با ثبت اولین ترید خود، شروع به بهبود استراتژی و
                          پیگیری دقیق معاملات کنید.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Card view for mobile */}
          <div className="md:hidden space-y-4">
            {filteredEntries.map((trade) => (
              <div
                key={trade.id}
                className="bg-white dark:bg-gray-800 dark-black:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 dark-black:border-gray-800 p-4 space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/20 rounded flex items-center justify-center text-indigo-600 font-black text-xs">
                      {trade.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                        {trade.symbol}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(trade.timestamp).toLocaleDateString("fa-IR")}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`font-bold text-xs ${
                      trade.type === "buy"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                    }`}
                  >
                    {trade.type === "buy" ? "خرید" : "فروش"}
                  </Badge>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">قیمت ورود</p>
                    <p className="font-bold text-gray-900 dark:text-gray-100">
                      {trade.entryPrice}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">حجم</p>
                    <p className="font-bold text-gray-900 dark:text-gray-100">
                      {trade.lotSize}
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded p-2">
                    <p className="text-xs text-red-600 dark:text-red-400">حد ضرر</p>
                    <p className="font-bold text-red-600 dark:text-red-400">
                      {trade.stopLoss}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded p-2">
                    <p className="text-xs text-green-600 dark:text-green-400">حد سود</p>
                    <p className="font-bold text-green-600 dark:text-green-400">
                      {trade.takeProfit}
                    </p>
                  </div>
                </div>

                {/* Status and Notes */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {trade.result === "win" && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                    {trade.result === "loss" && (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    {trade.result === "pending" && (
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                    )}
                    <span
                      className={`text-xs font-bold ${
                        trade.result === "win"
                          ? "text-green-600"
                          : trade.result === "loss"
                            ? "text-red-600"
                            : trade.result === "breakeven"
                              ? "text-indigo-600"
                              : "text-orange-600"
                      }`}
                    >
                      {trade.result === "win"
                        ? "سود"
                        : trade.result === "loss"
                          ? "ضرر"
                          : trade.result === "breakeven"
                            ? "سر‌به‌سر"
                            : "در جریان"}
                    </span>
                  </div>
                  {trade.notes && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {trade.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleEdit(trade)}
                    className="flex-1 h-11 flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded font-medium text-sm transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(trade.id)}
                    className="flex-1 h-11 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded font-medium text-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredEntries.length === 0 && (
            <div className="px-6 py-20 text-center">
              <div className="flex flex-col items-center max-w-xs mx-auto">
                <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-6">
                  <FileText className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                </div>
                <h5 className="text-lg font-black text-gray-900 dark:text-white mb-2">
                  ژورنال شما خالی است
                </h5>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  با ثبت اولین ترید خود، شروع به بهبود استراتژی و پیگیری دقیق معاملات کنید.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
