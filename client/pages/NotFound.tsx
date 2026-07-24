import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 dark-black:bg-gray-950">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white dark-black:text-white">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 dark-black:text-gray-500 mb-4">صفحه پیدا نشد!</p>
        <a href="/" className="text-indigo-600 dark:text-indigo-400 dark-black:text-indigo-400 hover:underline font-medium">
          بازگشت به صفحه اصلی
        </a>
      </div>
    </div>
  );
};

export default NotFound;
