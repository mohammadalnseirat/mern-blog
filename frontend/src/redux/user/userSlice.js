import { createSlice } from "@reduxjs/toolkit";

// intial state:
const initialState = {
  loading: false,
  currentUser: null,
  error: null,
};

// create slice:
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // signin Start:
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // signin Success:
    signInSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.currentUser = action.payload;
    },

    // signin Failure:
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { signInFailure, signInSuccess, signInStart } = userSlice.actions;
export default userSlice.reducer;