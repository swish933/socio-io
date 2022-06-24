import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../services/auth.service";
import { clearUser } from "./user";
import { clearPosts } from "./post";
import { clearProfile } from "./profile";

export const register = createAsyncThunk(
  "auth/register",
  async (arg, thunkAPI) => {
    try {
      const response = await AuthService.register(arg);
      return response.data;
    } catch (error) {
      if (error.response.data.errors) {
        return thunkAPI.rejectWithValue({
          msg: "Check that you entered all the right information",
        });
      }
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk("auth/login", async (arg, thunkAPI) => {
  try {
    const response = await AuthService.login(arg);
    return response.data;
  } catch (error) {
    if (error.response.data.errors) {
      return thunkAPI.rejectWithValue({
        msg: "Check that you entered the correct email/password",
      });
    }
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const logout = createAsyncThunk("auth/logout", async (arg, thunkAPI) => {
  AuthService.logout();
  thunkAPI.dispatch(clearUser());
  thunkAPI.dispatch(clearPosts());
  thunkAPI.dispatch(clearProfile());
});

const initialState = {
  isAuthenticated: localStorage.getItem("token") ? true : false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(register.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, { payload }) => {
      localStorage.setItem("token", payload.token);
      state.isLoading = false;
      state.isAuthenticated = localStorage.getItem("token") ? true : false;
    });
    builder.addCase(login.rejected, (state) => {
      localStorage.removeItem("token");
      state.isLoading = false;
      state.isAuthenticated = false;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
    });
  },
});

export const selectIsLoading = (state) => state.auth.isLoading;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
