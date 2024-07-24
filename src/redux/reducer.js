import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
  isLogIn: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLogin: (state, action) => {
      state.isLogIn = action.payload;
    },
  }
});

const persistConfig = {
  key: "auth",
  storage
};

export const { setIsLogin } = authSlice.actions;
export const authReducer = authSlice.reducer;
export const persistedReducer = persistReducer(persistConfig, authReducer);