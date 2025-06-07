import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { X } from "lucide-react";
import {
  addStock,
  removeStock,
  updateStock,
  convertToMarketOrder,
  checkAndPlaceDueOrders,
} from "../slices/stockOrderSlice";
const StockOrder = () => {
  
  const [isAddingStock, setIsAddingStock] = useState(false);
  const stocksList = useSelector((state) => state.stockOrder.stocksList);
  const liveData = useSelector((state) => state.liveData.data);
  const liveDataRef = useRef(liveData);
  const intervalMapRef = useRef({});
  const timeoutMapRef = useRef({});
  const dispatch = useDispatch();
  const exchange_map_type = {
    NSE: 1,
    NFO: 2,
    BSE: 3,
    BFO: 4,
  };
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const form = useForm({
    defaultValues: {
      stockSymbol: "",
      quantity: "",
      orderType: "MARKET",
      priceType: "",
      limitPrice: "100.123",
      numOfLimits: "1",
      expiryMinutes: "30",
      priceUpdateInterval: "5",
      side: "Buy",
      exchange: "NSE",
      //   timeToPlace: "",
    },
  });

  const onSubmit = async (data) => {
    const numericData = {
      ...data,
      quantity: parseInt(data.quantity, 10),
      limitPrice:
        data.priceType === "custom"
          ? parseFloat(data.limitPrice)
          : parseFloat((Math.random() * 1000 + 500).toFixed(2)),
      numOfLimits: parseInt(data.numOfLimits, 10),
      expiryMinutes: parseInt(data.expiryMinutes, 10),
      priceUpdateInterval: parseInt(data.priceUpdateInterval, 10),
      client_code: localStorage.getItem("email"),
    };

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
      createdAt: new Date().toISOString(),
      orderId: "",
      token: "",
    };

    const res = await fetch("http://localhost:8000/trade/subscribe", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbol: newStock.stockSymbol.trim(),
        mode: 3,
        exchangeType: exchange_map_type[newStock.exchange],
        correlation_id: `${newStock.stockSymbol}add123`,
        exchange: newStock.exchange,
        email: localStorage.getItem("email"),
      }),
    });

    const res_json = await res.json();
    console.log("Subscription res : ", res_json);
    dispatch(addStock({ ...newStock, token: res_json.token }));
    toast.success(`Added ${data.stockSymbol} to order list`);
    setIsAddingStock(false);
    form.reset();
  };

  useEffect(() => {
    liveDataRef.current = liveData;
  }, [liveData]);

  // Check and plce due orders
  useEffect(() => {
    const interval = setInterval(async () => {
      if (Array.isArray(liveDataRef.current) && liveDataRef.current.length > 0)
        console.log(liveDataRef.current);
      dispatch(checkAndPlaceDueOrders(liveDataRef.current));
    }, 1000); // every 5 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (!stocksList || stocksList.length === 0) return;
    stocksList.forEach((stock) => {
      if (!stock?.orderId) return;
      const existingInterval = timeoutMapRef.current[stock.id];
      if (!existingInterval) {
        const timeoutId = setTimeout(() => {
          dispatch(convertToMarketOrder(stock?.id));
        }, stock?.expiryMinutes * 1000);
        timeoutMapRef.current[stock?.id] = timeoutId;
      }
    });
  }, [stocksList, dispatch]);

  // Update orders
  useEffect(() => {
    stocksList.forEach((stock) => {
      if (!stock?.orderId) return;
      const isPending = stock?.status === "Pending";
      const existingInterval = intervalMapRef.current[stock.id];

      if (isPending && !existingInterval) {

        // Start a new interval if pending and no interval exists
        const intervalId = setInterval(async () => {
          console.log(`Updating stock ${stock.stockSymbol} to latest ltp`);

          try {
            const response = await fetch(
              "http://localhost:8000/trade/update-order",
              {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: localStorage.getItem("email"),
                  orderId: stock?.orderId,
                  price: `${
                    stock?.priceType !== "ltp"
                      ? liveDataRef.current[stock?.token]?.[
                          stock?.priceType
                        ]?.[0]?.price / 100
                      : liveDataRef.current[stock?.token]?.last_traded_price /
                        100
                  }`,
                  symbol: stock?.stockSymbol,
                  quantity: stock?.quantity,
                  orderType: stock?.orderType,
                  exchange: stock?.exchange,
                }),
              }
            );

            const data = await response.json();
            console.log("Updated order response: ", data);

            dispatch(
              updateStock({
                id: stock?.id,
                socketData: liveDataRef.current,
                orderId: stock?.orderId,
                lastUpdated: new Date().toISOString(),
              })
            );
          } catch (error) {
            console.error("Error updating stock:", error);
          }
        }, stock.priceUpdateInterval * 1000);

        intervalMapRef.current[stock.id] = intervalId;
      }

      // If not pending and interval exists, clear it
      if ((!isPending && existingInterval) || !stock?.orderId) {
        clearInterval(existingInterval);
        delete intervalMapRef.current[stock.id];
      }
    });

    return () => {
      // console.log("cleaning up update order intervals");
      Object.values(intervalMapRef.current).forEach(clearInterval);
      intervalMapRef.current = {};
    };
  }, [stocksList, dispatch]);


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
                              <SelectItem value="MARKET">Market</SelectItem>
                              <SelectItem value="LIMIT">Limit</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timeToPlace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time to Place Order</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} required />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="side"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Side</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select order side" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="BUY">Buy</SelectItem>
                              <SelectItem value="SELL">Sell</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="exchange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exchange</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Exchange" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="NSE">NSE</SelectItem>
                              <SelectItem value="NFO">NFO</SelectItem>
                              <SelectItem value="BSE">BSE</SelectItem>
                              <SelectItem value="BFO">BFO</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("orderType") === "LIMIT" && (
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
                                <SelectItem value="best_5_buy_data">
                                  Bid Price
                                </SelectItem>
                                <SelectItem value="best_5_sell_data">
                                  Ask Price
                                </SelectItem>
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

                    {form.watch("orderType") === "LIMIT" &&
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
                            Convert to Market After (seconds)
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
                          <FormLabel>Price Update Interval (seconds)</FormLabel>
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
                      <TableHead className="text-center">Symbol</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-center">Order Type</TableHead>
                      <TableHead className="text-center">Price</TableHead>
                      <TableHead className="text-center">Limits</TableHead>
                      <TableHead className="text-center">Qty/Limit</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Expiry</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stocksList.map((stock) => (
                      <TableRow key={stock.id} className="border-2 border-red-500">
                        <TableCell className="font-medium text-center">
                          {stock.stockSymbol}
                        </TableCell>
                        <TableCell className="text-center">{stock.quantity}</TableCell>
                        <TableCell className="text-center">{stock.orderType}</TableCell>
                        <TableCell className="text-center">
                          ₹{stock.limitPrice}
                          {stock.currentPrice && (
                            <div className="text-xs text-gray-500">
                              Current: ₹{stock.currentPrice.toFixed(2)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center">{stock.numOfLimits}</TableCell>
                        <TableCell className="text-center">
                          {stock.qtyPerLimit}
                          {stock.remainingQty > 0 && (
                            <span className="text-xs text-gray-500">
                              {" "}
                              (+{stock.remainingQty})
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-center"> 
                          <span
                              className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(
                                stock.status
                              )}`}
                            >
                              {stock.status}
                            </span>
                            </TableCell>
                        <TableCell className="text-center">
                          {stock.expiryMinutes} sec
                          <div className="text-xs text-gray-500">
                            Updates every {stock.priceUpdateInterval} sec
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => dispatch(removeStock(stock.id))}
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
          <div className="text-center py-8 border rounded-lg bg-gray-50 dark:bg-gray-900">
            <p className="text-gray-500">
              No stocks added yet. Click "Add New Stock" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockOrder;
