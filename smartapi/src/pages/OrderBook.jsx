import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import MainNavigation from "../components/MainNavigation";

const OrderBook = () => {
  const [filter, setFilter] = useState("");

  // Sample order data - in a real app, this would come from an API
  const orders = [
    {
      id: "1001",
      symbol: "NIFTY MAY FUT",
      type: "Buy",
      price: "22,450.00",
      quantity: 75,
      status: "Executed",
      time: "10:23:45",
    },
    {
      id: "1002",
      symbol: "RELIANCE",
      type: "Sell",
      price: "2,890.50",
      quantity: 100,
      status: "Pending",
      time: "10:25:30",
    },
    {
      id: "1003",
      symbol: "BANKNIFTY MAY FUT",
      type: "Buy",
      price: "48,275.25",
      quantity: 25,
      status: "Executed",
      time: "10:27:15",
    },
    {
      id: "1004",
      symbol: "HDFC BANK",
      type: "Sell",
      price: "1,678.75",
      quantity: 50,
      status: "Cancelled",
      time: "10:30:00",
    },
    {
      id: "1005",
      symbol: "INFOSYS",
      type: "Buy",
      price: "1,456.25",
      quantity: 200,
      status: "Executed",
      time: "10:32:20",
    },
    {
      id: "1006",
      symbol: "TCS",
      type: "Buy",
      price: "3,745.80",
      quantity: 30,
      status: "Pending",
      time: "10:35:45",
    },
    {
      id: "1007",
      symbol: "ICICI BANK",
      type: "Sell",
      price: "985.30",
      quantity: 150,
      status: "Executed",
      time: "10:40:10",
    },
    {
      id: "1008",
      symbol: "SENSEX MAY FUT",
      type: "Buy",
      price: "73,890.50",
      quantity: 10,
      status: "Pending",
      time: "10:45:30",
    },
  ];

  const filteredOrders = filter
    ? orders.filter(
        (order) =>
          order.symbol.toLowerCase().includes(filter.toLowerCase()) ||
          order.id.includes(filter) ||
          order.status.toLowerCase().includes(filter.toLowerCase())
      )
    : orders;

  // Get status-specific styling
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "executed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  // Get type-specific styling
  const getTypeStyle = (type) => {
    switch (type.toLowerCase()) {
      case "buy":
        return "text-green-600 dark:text-green-400 font-medium";
      case "sell":
        return "text-red-600 dark:text-red-400 font-medium";
      default:
        return "";
    }
  };

  return (
    <div>
      <MainNavigation />
      <div className="p-4 sm:p-6 md:p-8 animate-fade-in">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Order Book</h1>
            <div className="relative w-full sm:w-64 md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search orders..."
                className="pl-8 pr-4"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>

          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            {order.id}
                          </TableCell>
                          <TableCell>{order.symbol}</TableCell>
                          <TableCell className={getTypeStyle(order.type)}>
                            {order.type}
                          </TableCell>
                          <TableCell className="text-right">
                            ₹{order.price}
                          </TableCell>
                          <TableCell className="text-right">
                            {order.quantity}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell>{order.time}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-6 text-muted-foreground"
                        >
                          No orders found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Today's Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Orders Placed
                    </span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Orders Executed
                    </span>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Orders Pending
                    </span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Orders Cancelled
                    </span>
                    <span className="font-medium">2</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    New Buy Order
                  </Button>
                  <Button variant="outline" className="w-full">
                    New Sell Order
                  </Button>
                  <Button variant="outline" className="w-full">
                    Cancel All
                  </Button>
                  <Button variant="outline" className="w-full">
                    Order History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
