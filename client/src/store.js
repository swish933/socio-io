import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import alertReducer from "./slices/alert";
import userReducer from "./slices/user";
import postReducer from "./slices/post";
import profileReducer from "./slices/profile";

const reducer = {
  auth: authReducer,
  alert: alertReducer,
  user: userReducer,
  post: postReducer,
  profile: profileReducer,
};

export const store = configureStore({
  reducer: reducer,
  devTools: true,
});
