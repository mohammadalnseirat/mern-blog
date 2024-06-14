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
    // updateStart:
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // updateSuccess:
    updateSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.currentUser = action.payload;
    },
    // updateFailure:
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // deleteStart:
    deleteUserStart:(state)=>{
      state.loading = true;
      state.error = null;
    },
    // deleteSuccess:
    deleteUserSuccess:(state,action)=>{
      state.loading=false
      state.error = null
      state.currentUser = null
    },
    // deleteFailure:
    deleteUserFailure:(state,action)=>{
      state.loading=false
      state.error = action.payload
    },

    // signOutSuccess:
    signOutSuccess:(state,action)=>{
      state.loading=false
      state.error = null
      state.currentUser = null
    },
    // signOutFailure:
    sigOutFailure:(state,action)=>{
      state.loading=false
      state.error = action.payload
      state.currentUser = null
    }
  },
});

export const {
  signInFailure,
  signInSuccess,
  signInStart,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutSuccess,
  sigOutFailure,
} = userSlice.actions;
export default userSlice.reducer;
