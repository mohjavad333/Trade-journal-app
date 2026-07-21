import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface NewTradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewTradeModal({ open, onOpenChange }: NewTradeModalProps) {
  const [formData, setFormData] = useState({
    symbol: "XAUUSD",
    type: "BUY",
    lot: "0.1",
    entryPrice: "0",
    stopLoss: "0",
    takeProfit: "0",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Trade submitted:", formData);
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-right text-xl font-bold">
            جزئیات معاملۀ جدید
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Symbol Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">نماد</label>
              <Select value={formData.symbol} onValueChange={(value) => handleInputChange("symbol", value)}>
                <SelectTrigger className="text-right">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="XAUUSD">XAUUSD - طلا</SelectItem>
                  <SelectItem value="EURUSD">EURUSD</SelectItem>
                  <SelectItem value="GBPUSD">GBPUSD</SelectItem>
                  <SelectItem value="USDJPY">USDJPY</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">نوع پوزیشن</label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger className="text-right">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="BUY">
                    <span className="text-green-600">خرید (BUY)</span>
                  </SelectItem>
                  <SelectItem value="SELL">
                    <span className="text-red-600">فروش (SELL)</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lot and Entry Price Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                حجم (Lot) <span className="text-primary">☺️</span>
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.lot}
                onChange={(e) => handleInputChange("lot", e.target.value)}
                className="text-right"
                placeholder="0.1"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                قیمت ورود <span className="text-primary">💰</span>
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.entryPrice}
                onChange={(e) => handleInputChange("entryPrice", e.target.value)}
                className="text-right"
                placeholder="0"
              />
            </div>
          </div>

          {/* Stop Loss and Take Profit Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                حد ضرر (SL) <span className="text-red-600">🔴</span>
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.stopLoss}
                onChange={(e) => handleInputChange("stopLoss", e.target.value)}
                className="text-right"
                placeholder="0"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                حد سود (TP) <span className="text-green-600">💚</span>
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.takeProfit}
                onChange={(e) => handleInputChange("takeProfit", e.target.value)}
                className="text-right"
                placeholder="0"
              />
            </div>
          </div>

          {/* Tabs for additional settings */}
          <Tabs defaultValue="primary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="primary">مقدماتی</TabsTrigger>
              <TabsTrigger value="general">عمومی</TabsTrigger>
              <TabsTrigger value="investment">سرمایه‌گذاری</TabsTrigger>
            </TabsList>
            <TabsContent value="primary" className="space-y-4">
              <div className="text-sm text-gray-600">
                اطلاعات مقدماتی معاملۀ را در بالا تکمیل کنید
              </div>
            </TabsContent>
            <TabsContent value="general" className="space-y-4">
              <div className="text-sm text-gray-600">
                تنظیمات عمومی اینجا نمایش داده می‌شود
              </div>
            </TabsContent>
            <TabsContent value="investment" className="space-y-4">
              <div className="text-sm text-gray-600">
                اطلاعات سرمایه‌گذاری اینجا نمایش داده می‌شود
              </div>
            </TabsContent>
          </Tabs>

          {/* Notes */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              پادفشتهای تحلیلی
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="... چرا وارد شدم، شرایط بازار، etc"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
            <div className="flex items-start gap-2 mt-2">
              <Checkbox id="analytical" />
              <label htmlFor="analytical" className="text-xs text-gray-600">
                چرا وارد شدم چندشاخه ی سیاست $CHoCH $SMC شامل است.
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium"
            >
              ثبت ترید
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              انصراف
            </Button>
          </div>

          {/* Reminder at bottom */}
          <div className="bg-purple-50 rounded-lg p-3 text-xs text-purple-800">
            <strong>یادآوری:</strong> یادداشت‌های تحلیلی می‌تواند کمک شایانی برای
            بهتر شدن معاملات آینده باشد
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
