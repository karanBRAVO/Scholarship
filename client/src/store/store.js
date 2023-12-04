import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import persistorReducer from "./persistorReducer.js";

const store = configureStore({
  reducer: persistorReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

const persistorStore = persistStore(store);

export default { store, persistorStore };
