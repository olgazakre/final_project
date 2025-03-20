import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Инициализация с данными из localStorage и Cookies
const storedUser = localStorage.getItem("user");
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
      console.log("User data set in Redux:", action.payload);
      // Сохраняем в localStorage и Cookies
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      Cookies.set("token", action.payload.token, { expires: 7 });

      // Обновляем состояние Redux
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("user");
      Cookies.remove("token");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
