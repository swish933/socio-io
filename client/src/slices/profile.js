import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserService } from "../services/user.service";
import { PostService } from "../services/post.service";

export const getUser = createAsyncThunk(
  "profile/user",
  async (arg, thunkAPI) => {
    try {
      const response = await UserService.getUser(arg);
      return response.data;
    } catch (error) {
      thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getUserPosts = createAsyncThunk(
  "profile/userPosts",
  async (arg, thunkAPI) => {
    try {
      const response = await PostService.getUserPosts(arg);
      return response.data;
    } catch (error) {
      thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  posts: [],
  isLoading: false,
  error: false,
};

const profileSlice = createSlice({
  name: "profile",
  reducers: {
    clearProfile(state, action) {
      state.posts = [];
      state.user = null;
      state.isLoading = false;
      state.error = false;
    },
    removeProfilePost(state, action) {
      state.posts = state.posts.filter((post) => post?._id !== action.payload);
    },
  },
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state) => {
      state.isLoading = true;
      state.error = false;
      state.user = null;
    });
    builder.addCase(getUser.fulfilled, (state, { payload }) => {
      state.user = payload.user;
      state.isLoading = false;
    });
    builder.addCase(getUser.rejected, (state) => {
      state.isLoading = false;
      state.error = true;
    });
    builder.addCase(getUserPosts.pending, (state) => {
      state.isLoading = true;
      state.posts = [];
      state.error = false;
    });
    builder.addCase(getUserPosts.fulfilled, (state, { payload }) => {
      state.posts = payload.posts;
      state.isLoading = false;
    });
    builder.addCase(getUserPosts.rejected, (state) => {
      state.isLoading = false;
      state.error = true;
    });
  },
});

export const selectProfilePosts = (state) => state.profile.posts;
export const selectProfileUser = (state) => state.profile.user;
export const selectUserLoading = (state) => state.profile.isLoading;
export const { clearProfile, removeProfilePost } = profileSlice.actions;

export default profileSlice.reducer;
