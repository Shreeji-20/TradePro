import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stocksList: [],
};

export const stockOrderSlice = createSlice({
  name: "stockOrder",
  initialState,
  reducers: {
    addStock: (state, action) => {
      state.stocksList.push(action.payload);
    },
    removeStock: (state, action) => {
      state.stocksList = state.stocksList.filter(
        (stock) => stock.id !== action.payload
      );
    },
    updateStock: (state, action) => {
      const index = state.stocksList.findIndex(
        (stock) => stock.id === action.payload.id
      );
      if (index !== -1) {
        const limitPrice =
          action.payload.socketData[state.stocksList[index].token];
        state.stocksList[index] = {
          ...state.stocksList[index],
          limitPrice: limitPrice["last_traded_price"] / 100,
        };
      }
    },
    convertToMarketOrder: (state, action) => {
      const stock = state.stocksList.find((s) => s.id === action.payload);
      console.log(`Updating ${stock.stockSymbol} to Market`);
      if (stock) {
        stock.orderType = "MARKET";
        stock.price = null; // Optional: remove price field if not relevant for market orders
        stock.status = "Completed";
      }
    },
    setAllStocks: (state, action) => {
      state.stocksList = action.payload;
    },
  },
});

export const {
  addStock,
  removeStock,
  updateStock,
  setAllStocks,
  convertToMarketOrder,
} = stockOrderSlice.actions;

export default stockOrderSlice.reducer;

export const checkAndPlaceDueOrders =
  (liveData) => async (dispatch, getState) => {
    const { stocksList } = getState().stockOrder;
    const now = new Date();
    for (const stock of stocksList) {
      if (!stock.orderId && new Date(stock.timeToPlace) <= now) {
        try {
          console.log(
            "LTP : ",
            `${liveData[stock.token]["last_traded_price"] / 100}`
          );
          const response = await fetch(
            "http://localhost:8000/trade/place-order",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: localStorage.getItem("email"),
                order_type: stock.orderType,
                side: stock.side,
                symbol: stock.stockSymbol,
                quantity: stock.qtyPerLimit,
                price: `${liveData[stock.token]["last_traded_price"] / 100}`,
              }),
            }
          );
          const data = await response.json();
          console.log("orderplaces : ", data);
          // Assuming response includes orderId
          dispatch(
            updateStock({
              id: stock.id,
              updates: { orderId: data.order_id },
              socketData: liveData,
            })
          );
        } catch (err) {
          console.error(`Failed to place order for ${stock.symbol}:`, err);
        }
      }
    }
  };
