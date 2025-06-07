import { configureStore, createSlice } from "@reduxjs/toolkit";
import themeReducer from "../slices/themeSlice";
import stockOrderReducer from '../slices/stockOrderSlice';
import liveDataReducer from "../slices/liveDataSlice";
import orderBookReducer from "../slices/orderBook"
const store = configureStore({
  reducer: {
    theme: themeReducer,
    stockOrder: stockOrderReducer,
    liveData: liveDataReducer,
    orderBook: orderBookReducer
  },
});

export default store;
