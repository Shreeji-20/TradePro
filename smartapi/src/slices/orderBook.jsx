import { createSlice } from "@reduxjs/toolkit";

const orderBookSlice = createSlice({
  name: "orderBook",
  initialState: {
    data: {}, // You can structure this as needed (e.g., token -> data)
  },
  reducers: {
    setOrderBook(state, action) {
      const { payload } = action.payload;
      state.data = payload;
    },
  },
});

export const { setOrderBook } = orderBookSlice.actions;
export default orderBookSlice.reducer;