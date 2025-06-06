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
      console.log("New Stock Added : ", action.payload);
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
          orderId: action.payload.orderId,
        };
      }
    },
    convertToMarketOrder: (state, action) => {
      const stock = state.stocksList.find((s) => s?.id === action?.payload);
      console.log(`Converting ${stock?.stockSymbol} to Market`);
      if (stock && stock?.status === "Pending") {
        stock.orderType = "MARKET";
        stock.price = "0"; // Optional: remove price field if not relevant for market orders
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
    var price = 0;
    // console.log("Check and place due orders function invoked");
    for (const stock of stocksList) {
      if (!stock?.orderId && new Date(stock?.timeToPlace) <= now) {
        try {
          if (stock?.priceType !== "ltp") {
            price =
              liveData[stock?.token][`${stock?.priceType}`][0]["price"] / 100;
          } else {
            price = liveData[stock?.token]["last_traded_price"] / 100;
          }

          const response = await fetch(
            "http://localhost:8000/trade/place-order",
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: localStorage.getItem("email"),
                order_type: stock?.orderType,
                side: stock?.side,
                symbol: stock?.stockSymbol,
                quantity: stock?.qtyPerLimit,
                price: `${price}`,
              }),
            }
          );

          const data = await response.json();
          console.log("orderplaced : ", data);

          dispatch(
            updateStock({
              id: stock?.id,
              orderId: data?.order_id,
              socketData: liveData,
              price: price,
            })
          );
        } catch (err) {
          console.error(`Failed to place order for ${stock?.symbol}:`, err);
        }
      }
    }
  };
