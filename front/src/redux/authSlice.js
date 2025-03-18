import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const storedUser = Cookies.get("user");
const storedToken = Cookies.get("token");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      Cookies.set("user", JSON.stringify(action.payload.user), { expires: 7 }); 
      Cookies.set("token", action.payload.token, { expires: 7 });
    },
    logout: (state) => {
      state.user = null;
      state.token = null;

      Cookies.remove("user");
      Cookies.remove("token");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
