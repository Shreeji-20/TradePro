import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { User, List, Settings } from "lucide-react";
import ThemeToggle from "./toogle_theme";
const MainNavigation = () => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Order Book", path: "/orderbook" },
    { name: "Profile", path: "/profile" },
    { name: "Stock Order", path: "/stockorder" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">

          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                Trade
              </span>
              <span className="text-xl font-bold">Pro</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2",
                    location.pathname === link.path
                      ? "border-indigo-500 text-gray-900 dark:text-gray-100"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <ThemeToggle/>
            </div>
          </div>

          <div className="hidden md:ml-4 md:flex md:items-center">
            <Link
              to="/profile"
              className={cn(
                "p-2 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200",
                location.pathname === "/profile" &&
                  "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300"
              )}
            >
              <User className="h-5 w-5" />
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <div className="flex flex-col">
              <div className="flex space-x-4">
                <Link
                  to="/dashboard"
                  className={cn(
                    "p-2 rounded-md",
                    location.pathname === "/dashboard"
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  <Settings className="h-5 w-5" />
                </Link>
                <Link
                  to="/orderbook"
                  className={cn(
                    "p-2 rounded-md",
                    location.pathname === "/orderbook"
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  <List className="h-5 w-5" />
                </Link>
                <Link
                  to="/profile"
                  className={cn(
                    "p-2 rounded-md",
                    location.pathname === "/profile"
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  <User className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
