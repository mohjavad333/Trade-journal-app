import { ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: "blue" | "red" | "green" | "purple";
}

export default function StatsCard({
  label,
  value,
  subtitle,
  icon,
  color = "blue",
}: StatsCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white dark:bg-[hsl(var(--card))] dark-black:bg-[hsl(var(--card))] rounded-lg border border-gray-200 dark:border-gray-700 dark-black:border-gray-900 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 dark-black:text-gray-500 mb-2">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-white dark-black:text-white">{value}</p>
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500 dark-black:text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div
            className={`${colorClasses[color]} p-3 rounded-lg flex items-center justify-center`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
