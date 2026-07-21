import { Bell } from "lucide-react";
import { useState } from "react";

export default function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    { id: 1, message: "معاملۀ جدید ثبت شد", time: "2 دقیقه پیش" },
    { id: 2, message: "هدف سود به دست آمد", time: "1 ساعت پیش" },
    { id: 3, message: "حد ضرر فعال شد", time: "3 ساعت پیش" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 dark:text-gray-300 dark-black:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark-black:hover:bg-gray-900 rounded-lg transition"
      >
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[hsl(var(--card))] dark-black:bg-[hsl(var(--card))] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 dark-black:border-gray-900 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 dark-black:border-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-white dark-black:text-white">
              اعلانات
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-4 border-b border-gray-100 dark:border-gray-700 dark-black:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 dark-black:hover:bg-gray-900 transition"
                >
                  <p className="text-sm text-gray-900 dark:text-gray-100 dark-black:text-gray-100">
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 dark-black:text-gray-500 mt-1">
                    {notif.time}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                هیچ اعلانی نیست
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
