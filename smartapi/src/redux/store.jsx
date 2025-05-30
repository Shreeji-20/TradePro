import { configureStore, createSlice } from "@reduxjs/toolkit";
import themeReducer from "../slices/themeSlice";
import stockOrderReducer from '../slices/stockOrderSlice';
import liveDataReducer from "../slices/liveDataSlice"
const store = configureStore({
  reducer: {
    theme: themeReducer,
    stockOrder: stockOrderReducer,
    liveData: liveDataReducer
  },
});

export default store;
