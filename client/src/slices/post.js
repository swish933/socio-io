import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PostService } from "../services/post.service";
import { removeProfilePost } from "./profile";

export const getTimelinePosts = createAsyncThunk(
  "posts/timelinePosts",
  async (arg, thunkAPI) => {
    try {
      const response = await PostService.getTimeline();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue();
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (arg, thunkAPI) => {
    try {
      const response = await PostService.newPost(arg);
      thunkAPI.dispatch(getTimelinePosts());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        msg: "Make sure you entered a caption",
      });
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (arg, thunkAPI) => {
    try {
      const response = await PostService.deletePost(arg);
      thunkAPI.dispatch(removePost(arg));
      thunkAPI.dispatch(removeProfilePost(arg));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const likePost = createAsyncThunk(
  "posts/likePost",
  async (arg, thunkAPI) => {
    try {
      const response = await PostService.likePost(arg);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  isLoading: {
    timeline: false,
    user: false,
    post: false,
    delete: false,
    like: false,
  },
  posts: [],
  userPosts: [],
  error: {
    timeline: false,
    user: false,
    post: false,
    delete: false,
  },
};

const postSlice = createSlice({
  name: "post",
  reducers: {
    removePost(state, action) {
      state.posts = state.posts.filter((post) => post?._id !== action.payload);
    },

    clearPosts(state, action) {
      state.posts = [];
      state.userPosts = [];
    },
  },
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getTimelinePosts.pending, (state) => {
      state.isLoading.timeline = true;
    });
    builder.addCase(getTimelinePosts.fulfilled, (state, { payload }) => {
      state.posts = payload.posts;
      state.isLoading.timeline = false;
    });
    builder.addCase(getTimelinePosts.rejected, (state) => {
      state.isLoading.timeline = false;
      state.error.timeline = true;
    });

    builder.addCase(createPost.pending, (state) => {
      state.isLoading.post = true;
    });
    builder.addCase(createPost.fulfilled, (state, { payload }) => {
      state.isLoading.post = false;
    });
    builder.addCase(createPost.rejected, (state, payload) => {
      state.isLoading.post = false;
      state.error.post = true;
    });
    builder.addCase(deletePost.pending, (state) => {
      state.isLoading.delete = true;
      state.error.delete = false;
    });
    builder.addCase(deletePost.fulfilled, (state, { payload }) => {
      state.isLoading.delete = false;
    });
    builder.addCase(deletePost.rejected, (state, payload) => {
      state.isLoading.delete = false;
      state.error.delete = true;
    });
    builder.addCase(likePost.pending, (state) => {
      state.isLoading.like = true;
    });
    builder.addCase(likePost.fulfilled, (state, { payload }) => {
      state.isLoading.like = false;
    });
    builder.addCase(likePost.rejected, (state, payload) => {
      state.isLoading.like = false;
    });
  },
});

export const selectPosts = (state) => state.post.posts;
export const selectUserPosts = (state) => state.post.userPosts;
export const selectPostLoading = (state) => state.post.isLoading.post;
export const selectUserLoading = (state) => state.post.isLoading.user;
export const selectTimelineLoading = (state) => state.post.isLoading.timeline;
export const selectDeletePostsLoading = (state) => state.post.isLoading.delete;
export const selectLikePostLoading = (state) => state.post.isLoading.like;

export const { clearPosts, removePost, refreshPost } = postSlice.actions;

export default postSlice.reducer;
