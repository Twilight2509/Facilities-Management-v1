import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {};

const storeUser = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<any>) => {
      console.log("====================================");
      console.log("user::", action.payload);
      console.log("====================================");
      state.value = action.payload;
    },
  },
});

export const { addUser } = storeUser.actions;
export default storeUser.reducer;
