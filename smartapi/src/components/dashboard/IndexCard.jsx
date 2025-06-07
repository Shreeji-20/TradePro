import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";

const IndexCard = ({ name, value, change, changePercentage, isPositive }) => {
  return (
    // <div className="transition transform duration-300 hover:-translate-y-2 hover:shadow-xl rounded-2xl p-4 bg-white">
    <Card className="overflow-hidden transition transform duration-300 hover:-translate-y-2 hover:shadow-xl rounded-2xl p-2">
      <CardContent className="p-4">
        <div className="flex items-center justify-between ">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mr-3">
              <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400">
                {name}
              </h3>
              <p className="text-xl font-bold">{value.toLocaleString()}</p>
            </div>
          </div>

          <div
            className={`flex flex-col items-end ${
              isPositive
                ? "text-green-600 dark:text-green-500"
                : "text-red-600 dark:text-red-500"
            }`}
          >
            <div className="flex items-center">
              {isPositive ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              <span className="font-medium">{change.toLocaleString()}</span>
            </div>
            <span className="text-sm">({changePercentage}%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
    // </div>
  );
};

export default IndexCard;
