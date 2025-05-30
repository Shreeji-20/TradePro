// src/store/liveDataSlice.js
import { createSlice } from "@reduxjs/toolkit";

const liveDataSlice = createSlice({
  name: "liveData",
  initialState: {
    data: {}, // You can structure this as needed (e.g., token -> data)
  },
  reducers: {
    setLiveData(state, action) {
      const { payload } = action.payload;
      state.data = payload;
    },
  },
});

export const { setLiveData } = liveDataSlice.actions;
export default liveDataSlice.reducer;
