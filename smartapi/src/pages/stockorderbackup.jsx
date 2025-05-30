import React, { useState, useEffect, useRef } from "react";
import MainNavigation from "../components/MainNavigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, X } from "lucide-react";

const StockOrder = () => {
  const [stocksList, setStocksList] = useState([]);
  const [isAddingStock, setIsAddingStock] = useState(false);
  const stockListref = useRef(stocksList);

  const form = useForm({
    defaultValues: {
      stockSymbol: "",
      quantity: "",
      orderType: "limit",
      priceType: "ltp", // New default value
      limitPrice: "",
      numOfLimits: "1",
      expiryMinutes: "30",
      priceUpdateInterval: "5",
    },
  });

  const onSubmit = async (data) => {
    // Convert string values to numbers
    const numericData = {
      ...data,
      quantity: parseInt(data.quantity, 10),
      limitPrice: data.priceType === "custom" ? parseFloat(data.limitPrice) : 0,
      numOfLimits: parseInt(data.numOfLimits, 10),
      expiryMinutes: parseInt(data.expiryMinutes, 10),
      priceUpdateInterval: parseInt(data.priceUpdateInterval, 10),
      client_code: sessionStorage.getItem("email"),
    };

    // In a real application, we would fetch the actual prices based on priceType
    // For simulation, we're using a random value if it's not custom
    if (data.priceType !== "custom") {
      // Simulate fetching price for the selected type (bid, ask, etc.)
      numericData.limitPrice = parseFloat(
        (Math.random() * 1000 + 500).toFixed(2)
      );
    }

    // Calculate qty per limit
    const qtyPerLimit = Math.floor(
      numericData.quantity / numericData.numOfLimits
    );
    const remainingQty = numericData.quantity % numericData.numOfLimits;

    const newStock = {
      ...numericData,
      id: Date.now(),
      qtyPerLimit,
      remainingQty,
      status: "Pending",
      createdAt: new Date(),
      orderId: "",
      //   lastUpdated: new Date(),
    };

    // const response = await fetch("http://localhost:8000/trade/addorder", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(newStock),
    // });

    const res = await response.json();
    console.log(res);

    setStocksList([...stocksList, newStock]);
    toast.success(Added ${data.stockSymbol} to order list);
    setIsAddingStock(false);
    form.reset();
  };

  // Modify after 30 sec
  useEffect(() => {
    if (stocksList.length === 0) return;

    const intervalIds = stocksList.map((stock) => {
      return setInterval(() => {
        updateStockPrice(stock.id);
      }, stock.priceUpdateInterval * 1000);
    });

    return () => {
      intervalIds.forEach((id) => clearInterval(id));
    };
  }, [stocksList]);

  // Modify fun

  const updateStockPrice = (stockId) => {
    setStocksList((prevStocks) =>
      prevStocks.map(async (stock) => {
        if (stock.id === stockId) {
          //here modify order will come just call it
          const response = await fetch(
            "http://localhost:8000/trade/modifyorder",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(stock),
            }
          );
          return {
            ...stock,
            // currentPrice: newPrice,
            lastUpdated: new Date(),
          };
        }
        return stock;
      })
    );
  };

  // Function to convert limit order to market order after expiry
  useEffect(() => {
    if (stocksList.length === 0) return;

    const timeoutIds = stocksList.map((stock) => {
      if (stock.status === "Pending") {
        return setTimeout(() => {
          convertToMarketOrder(stock.id);
        }, stock.expiryMinutes * 60 * 1000); // Convert minutes to milliseconds
      }
      return null;
    });

    return () => {
      timeoutIds.forEach((id) => id && clearTimeout(id));
    };
  }, [stocksList]);

  const convertToMarketOrder = (stockId) => {
    setStocksList((prevStocks) =>
      prevStocks.map(async (stock) => {
        if (stock.id === stockId && stock.status === "Pending") {
          toast.info(
            Converting ${stock.stockSymbol} to market order due to expiry
          );
          const response = await fetch(
            "http://localhost:8000/trade/modifyorder",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ...stock, orderType: "MARKET" }),
            }
          );
          return {
            ...stock,
            orderType: "MARKET",
            status: "Market",
          };
        }
        return stock;
      })
    );
  };

  // Function to remove a stock from the list
  const removeStock = async (stockId) => {
    // const response = await fetch("http://localhost:8000/trade/deleteorder", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ id: stockId }),
    // });
    // const res = await response.json();
    // console.log(res);
    setStocksList((prevStocks) =>
      prevStocks.filter((stock) => stock.id !== stockId)
    );
    toast.info("Order removed from list");
  };

  return (
    <div>
      <MainNavigation />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Stock Order Management</h1>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl">Orders List</h2>
          <Button onClick={() => setIsAddingStock(true)}>Add New Stock</Button>
        </div>

        {isAddingStock && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Stock Order</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="stockSymbol"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock Symbol</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., ZOMATO, RELIANCE"
                              {...field}
                              required
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="e.g., 50"
                              {...field}
                              required
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="orderType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select order type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="market">Market</SelectItem>
                              <SelectItem value="limit">Limit</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("orderType") === "limit" && (
                      <FormField
                        control={form.control}
                        name="priceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select price type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="bid">Bid Price</SelectItem>
                                <SelectItem value="ask">Ask Price</SelectItem>
                                <SelectItem value="ltp">
                                  LTP (Last Traded Price)
                                </SelectItem>
                                <SelectItem value="custom">
                                  Custom Price
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {form.watch("orderType") === "limit" &&
                      form.watch("priceType") === "custom" && (
                        <FormField
                          control={form.control}
                          name="limitPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Custom Price</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0.01"
                                  placeholder="e.g., 500.50"
                                  {...field}
                                  required
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                    <FormField
                      control={form.control}
                      name="numOfLimits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Limits</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="e.g., 10"
                              {...field}
                              required
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expiryMinutes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Convert to Market After (minutes)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="e.g., 30"
                              {...field}
                              required
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priceUpdateInterval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Update Interval (minutes)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="e.g., 5"
                              {...field}
                              required
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddingStock(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Add to List</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {stocksList.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Order Type</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Limits</TableHead>
                      <TableHead>Qty/Limit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stocksList.map((stock) => (
                      <TableRow key={stock.id}>
                        <TableCell className="font-medium">
                          {stock.stockSymbol}
                        </TableCell>
                        <TableCell>{stock.quantity}</TableCell>
                        <TableCell>
                          {stock.orderType === "market" ? "Market" : "Limit"}
                        </TableCell>
                        <TableCell>
                          {stock.orderType === "limit"
                            ? ₹${stock.limitPrice.toFixed(2)}
                            : "Market Price"}
                          {stock.currentPrice && (
                            <div className="text-xs text-gray-500">
                              Current: ₹{stock.currentPrice.toFixed(2)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{stock.numOfLimits}</TableCell>
                        <TableCell>
                          {stock.qtyPerLimit}
                          {stock.remainingQty > 0 && (
                            <span className="text-xs text-gray-500">
                              {" "}
                              (+{stock.remainingQty})
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{stock.status}</TableCell>
                        <TableCell>
                          {stock.expiryMinutes} min
                          <div className="text-xs text-gray-500">
                            Updates every {stock.priceUpdateInterval} min
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStock(stock.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-8 border rounded-lg bg-gray-50">
            <p className="text-gray-500">
              No stocks added yet. Click "Add New Stock" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockOrder;