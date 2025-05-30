import React from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardHeader = () => {
  const isMobile = useIsMobile();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link
            to="/dashboard"
            className="text-xl font-bold text-indigo-600 dark:text-indigo-400"
          >
            TradeView
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="hidden sm:inline-block">Last Updated: </span>
            {new Date().toLocaleTimeString()}
          </div>

          {!isMobile && (
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-800/50"
            >
              Sign Out
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
