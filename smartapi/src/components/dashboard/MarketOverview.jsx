import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { IndexCardWrapper } from "./IndexCardWrapper";

const MarketOverview = () => {
  const marketData = {
    indices: [
      {
        id: 1,
        name: "NIFTY 50",
        value: 22371.24,
        change: 35.75,
        changePercentage: 0.16,
        isPositive: true,
      },
      {
        id: 2,
        name: "SENSEX",
        value: 73667.19,
        change: 115.64,
        changePercentage: 0.16,
        isPositive: true,
      },
      {
        id: 3,
        name: "BANK NIFTY",
        value: 47382.05,
        change: -42.3,
        changePercentage: 0.09,
        isPositive: false,
      },
      {
        id: 4,
        name: "NIFTY MIDCAP",
        value: 48442.25,
        change: 216.4,
        changePercentage: 0.45,
        isPositive: true,
      },
      {
        id: 5,
        name: "NIFTY SMALLCAP",
        value: 15724.15,
        change: -32.75,
        changePercentage: 0.21,
        isPositive: false,
      },
      {
        id: 6,
        name: "INDIA VIX",
        value: 14.02,
        change: -0.84,
        changePercentage: 5.65,
        isPositive: false,
      },
    ],
  };

  const baseIndices = [
    {
      id: 1,
      name: "NIFTY 50",
      token: "26000",
      value: 22371.24,
      change: 35.75,
      changePercentage: 0.16,
      exchangeType: 1,
    },
    {
      id: 2,
      name: "FINNIFTY",
      token: "26037",
      value: 73667.19,
      change: 115.64,
      changePercentage: 0.16,
      exchangeType: 1,
    },
    {
      id: 3,
      name: "BANK NIFTY",
      token: "26009",
      value: 47382.05,
      change: -42.3,
      changePercentage: 0.09,
      exchangeType: 1,
    },
    {
      id: 4,
      name: "NIFTY MIDCAP",
      token: "26074",
      value: 48442.25,
      change: 216.4,
      changePercentage: 0.45,
      exchangeType: 1,
    },
    {
      id: 5,
      name: "BANKEX",
      token: "99919012",
      value: 15724.15,
      change: -32.75,
      changePercentage: 0.21,
      exchangeType: 3,
    },
    {
      id: 6,
      name: "SENSEX",
      token: "99919000",
      value: 14.02,
      change: -0.84,
      changePercentage: 5.65,
      exchangeType: 3,
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Market Overview</h2>

      <Tabs defaultValue="indices" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="indices">Indices</TabsTrigger>
          <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
          <TabsTrigger value="losers">Top Losers</TabsTrigger>
        </TabsList>

        <TabsContent
          value="indices"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {baseIndices.map((index) => (
            <IndexCardWrapper key={index.id} index={index} />
          ))}
        </TabsContent>

        <TabsContent value="gainers" className="text-center py-8 text-gray-500">
          Top gainers data will appear here
        </TabsContent>

        <TabsContent value="losers" className="text-center py-8 text-gray-500">
          Top losers data will appear here
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketOverview;
