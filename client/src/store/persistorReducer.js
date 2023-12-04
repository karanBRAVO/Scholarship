import rootReducer from "./rootReducer";
import { persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/es/storage/session";

const persistConfig = {
  key: "root",
  storage: sessionStorage,
  version: 1,
};

export default persistReducer(persistConfig, rootReducer);
