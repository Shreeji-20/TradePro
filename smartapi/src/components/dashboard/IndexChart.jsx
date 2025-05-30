import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

// Sample data generator
const generateChartData = (points = 12, baseValue = 20000, volatility = 200) => {
  const data = [];
  let lastValue = baseValue;
  
  for (let i = 0; i < points; i++) {
    // Random walk with volatility
    lastValue = lastValue + (Math.random() - 0.5) * 2 * volatility;
    
    data.push({
      time: `${i}:00`,
      value: Math.round(lastValue),
    });
  }
  
  return data;
};

const IndexChart = ({ name, isPositive }) => {
  const isMobile = useIsMobile();
  const data = generateChartData();
  
  const config = {
    value: {
      label: "Value",
      color: isPositive ? "#10b981" : "#ef4444",
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-medium text-lg">{name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Today's movement</p>
        </div>
        
        <div className="h-60">
          <ChartContainer
            config={config}
            className="h-full w-full"
          >
            <LineChart
              data={data}
              margin={isMobile ? { top: 5, right: 5, bottom: 5, left: 5 } : { top: 10, right: 10, bottom: 20, left: 25 }}
            >
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) => value}
                fontSize={12}
                hide={isMobile}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${Math.round(value / 1000)}K`}
                fontSize={12}
                width={isMobile ? 35 : 50}
              />
              <Line
                type="monotone"
                dataKey="value"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                stroke={isPositive ? "var(--color-value, #10b981)" : "var(--color-value, #ef4444)"}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                cursor={{ stroke: "#9ca3af", strokeWidth: 1, strokeDasharray: "4 4" }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndexChart;