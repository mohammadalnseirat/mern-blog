import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist";

const rootReducer = combineReducers({
  user: userReducer,
});

// configuration persistence:
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

// persisted Reducer:
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// persistor:
export const persistor = persistStore(store);
