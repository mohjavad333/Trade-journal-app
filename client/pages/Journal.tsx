import { FileText } from "lucide-react";

export default function Journal() {
  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 dark:bg-gray-900 dark-black:bg-gray-950 pt-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white dark-black:text-white">
            ژورنال
          </h1>
        </div>

        <div className="bg-white dark:bg-[hsl(var(--card))] dark-black:bg-[hsl(var(--card))] rounded-lg border border-gray-200 dark:border-gray-700 dark-black:border-gray-900 p-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 dark-black:text-gray-400 mb-4">
            صفحۀ ژورنال در حال توسعه است
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 dark-black:text-gray-500">
            برای ادامه، لطفاً صفحات دیگر را بررسی کنید
          </p>
        </div>
      </div>
    </div>
  );
}
