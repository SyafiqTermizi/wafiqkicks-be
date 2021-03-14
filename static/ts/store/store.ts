import { configureStore } from "@reduxjs/toolkit";

import user from "./userSlice";

const preloadedState = {
  user: {
    email: localStorage.getItem("email") || "",
    username: localStorage.getItem("username") || "",
    token: localStorage.getItem("token") || "",
  },
};

export const store = configureStore({
  reducer: { user },
  preloadedState,
});

const saveStateToLocalStorage = () => {
  const userState = store.getState().user;
  localStorage.setItem("token", userState.token);
  localStorage.setItem("email", userState.email);
  localStorage.setItem("username", userState.username);
};
store.subscribe(() => saveStateToLocalStorage());

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
