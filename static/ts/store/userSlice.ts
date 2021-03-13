import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface iUserState {
  username: string;
  email: string;
  token: string;
}

const initialState: iUserState = {
  username: "",
  email: "",
  token: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setValues: (state, action: PayloadAction<iUserState>) => action.payload,
  },
});

export const { setValues } = userSlice.actions;
export default userSlice.reducer;
