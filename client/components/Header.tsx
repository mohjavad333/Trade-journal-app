import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Sun, Moon } from "lucide-react";

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark" | "dark-black">("light");

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "dark-black" | null;
      if (savedTheme) {
        setTheme(savedTheme);
        applyThemeToDOM(savedTheme);
      }
    } catch (err) {
      console.warn("Failed to load theme from localStorage", err);
    }
  }, []);

  // Apply theme to DOM immediately (not in render)
  const applyThemeToDOM = (newTheme: "light" | "dark" | "dark-black") => {
    try {
      const html = document.documentElement;
      // Use requestAnimationFrame for smooth transition
      requestAnimationFrame(() => {
        html.classList.remove("dark", "dark-black");
        if (newTheme !== "light") {
          html.classList.add(newTheme);
        }
      });
      // Save to localStorage asynchronously
      setTimeout(() => {
        localStorage.setItem("theme", newTheme);
      }, 0);
    } catch (err) {
      console.warn("Failed to apply theme", err);
    }
  };

  // Use useCallback to prevent unnecessary re-renders if this component is memoized
  const toggleTheme = useCallback(() => {
    const themes: ("light" | "dark" | "dark-black")[] = ["light", "dark", "dark-black"];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];

    // Apply theme to DOM first (before state update)
    applyThemeToDOM(nextTheme);
    // Then update React state
    setTheme(nextTheme);
  }, [theme]);

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "روشن";
      case "dark":
        return "تاریک";
      case "dark-black":
        return "مشکی";
      default:
        return "روشن";
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-[hsl(var(--card))]/80 dark-black:bg-[hsl(var(--card))]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 dark-black:border-gray-900 transition-colors">
      <div dir="rtl" className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white dark-black:text-white">
            TradeAnalyzer
          </h1>
        </Link>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 dark-black:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 dark-black:hover:text-indigo-400 transition px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark-black:hover:bg-gray-900"
          title={`تم: ${getThemeLabel()}`}
        >
          {theme === "light" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span className="text-xs">{getThemeLabel()}</span>
        </button>
      </div>
    </header>
  );
}
