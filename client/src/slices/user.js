import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UserService } from "../services/user.service";
import { getUser } from "./profile";

export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (arg, thunkAPI) => {
    try {
      const response = await UserService.loadLoggedInUser();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const follow = createAsyncThunk(
  "user/followUser",
  async (arg, thunkAPI) => {
    try {
      const response = await UserService.followUser(arg);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const unfollow = createAsyncThunk(
  "user/unfollowUser",
  async (arg, thunkAPI) => {
    try {
      const response = await UserService.unfollowUser(arg);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const uploadProfilePicture = createAsyncThunk(
  "user/uploadProfilePic",
  async ({ profilePicture, userName }, thunkAPI) => {
    try {
      const response = await UserService.uploadProfilePicture(
        JSON.stringify({ profilePicture })
      );
      thunkAPI.dispatch(getUser(userName));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const uploadCoverPicture = createAsyncThunk(
  "user/uploadCoverPic",
  async ({ coverPicture, userName }, thunkAPI) => {
    try {
      const response = await UserService.uploadCoverPicture(
        JSON.stringify({ coverPicture })
      );
      thunkAPI.dispatch(getUser(userName));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const deleteProfilePicture = createAsyncThunk(
  "user/deleteProfilePic",
  async ({ photoId, userName }, thunkAPI) => {
    try {
      const response = await UserService.deleteProfilePicture(photoId);
      thunkAPI.dispatch(getUser(userName));

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const deleteCoverPicture = createAsyncThunk(
  "user/deleteCoverPic",
  async ({ photoId, userName }, thunkAPI) => {
    try {
      const response = await UserService.deleteCoverPicture(photoId);
      thunkAPI.dispatch(getUser(userName));

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  user: null,
  isLoading: {
    user: false,
    follow: false,
    profilePicture: false,
    coverPicture: false,
  },
  error: { user: false, profilePicture: false, coverPicture: false },
};

const userSlice = createSlice({
  name: "user",
  reducers: {
    clearUser(state, action) {
      state.user = null;
    },
  },
  initialState,
  extraReducers: (builder) => {
    builder.addCase(loadUser.pending, (state) => {
      state.isLoading.user = true;
    });
    builder.addCase(loadUser.fulfilled, (state, { payload }) => {
      state.user = payload.user;
      state.isAuthenticated = true;
      state.isLoading.user = false;
    });
    builder.addCase(loadUser.rejected, (state) => {
      localStorage.removeItem("token");
      state.isAuthenticated = false;
      state.isLoading.user = false;
    });

    builder.addCase(uploadProfilePicture.pending, (state) => {
      state.isLoading.profilePicture = true;
      state.error.profilePicture = false;
    });
    builder.addCase(uploadProfilePicture.fulfilled, (state, { payload }) => {
      state.isLoading.profilePicture = false;
      state.user.profilePicture.publicId = payload.publicId;
      state.user.profilePicture.secureUrl = payload.secureUrl;
      state.error.profilePicture = false;
    });
    builder.addCase(uploadProfilePicture.rejected, (state) => {
      state.isLoading.profilePicture = false;
      state.error.profilePicture = true;
    });
    builder.addCase(deleteProfilePicture.pending, (state) => {
      state.isLoading.profilePicture = true;
      state.error.profilePicture = false;
    });
    builder.addCase(deleteProfilePicture.fulfilled, (state) => {
      state.isLoading.profilePicture = false;
      state.user.profilePicture.publicId = "";
      state.user.profilePicture.secureUrl = "";
      state.error.profilePicture = false;
    });
    builder.addCase(deleteProfilePicture.rejected, (state) => {
      state.isLoading.profilePicture = false;
      state.error.profilePicture = true;
    });
    builder.addCase(uploadCoverPicture.pending, (state) => {
      state.isLoading.coverPicture = true;
      state.error.coverPicture = false;
    });
    builder.addCase(uploadCoverPicture.fulfilled, (state, { payload }) => {
      state.isLoading.coverPicture = false;
      state.user.coverPicture.publicId = payload.publicId;
      state.user.coverPicture.secureUrl = payload.secureUrl;
      state.error.coverPicture = false;
    });
    builder.addCase(uploadCoverPicture.rejected, (state) => {
      state.isLoading.coverPicture = false;
      state.error.coverPicture = true;
    });
    builder.addCase(deleteCoverPicture.pending, (state) => {
      state.isLoading.coverPicture = true;
      state.error.coverPicture = false;
    });
    builder.addCase(deleteCoverPicture.fulfilled, (state, { payload }) => {
      state.isLoading.coverPicture = false;
      state.user.coverPicture.publicId = "";
      state.user.coverPicture.secureUrl = "";
      state.error.coverPicture = false;
    });
    builder.addCase(deleteCoverPicture.rejected, (state) => {
      state.isLoading.coverPicture = false;
      state.error.coverPicture = true;
    });
  },
});

export const selectCurrentUser = (state) => state.user.user;
export const selectProfilePictureLoading = (state) =>
  state.user.isLoading.profilePicture;
export const selectCoverPictureLoading = (state) =>
  state.user.isLoading.coverPicture;

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
