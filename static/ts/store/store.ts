import { configureStore } from "@reduxjs/toolkit";

import user from "./userSlice";

export const store = configureStore({
  reducer: { user },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
