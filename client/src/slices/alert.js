import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = [];

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setAlert: (state, { payload }) => {
      const id = nanoid(); //create unique alert id
      state.push({ ...payload, id }); //add alert to state
    },
    clearAlert: (state, { payload }) => {
      return state.filter((alert) => alert.id !== payload);
    },
  },
});

const { reducer, actions } = alertSlice;

export const selectAlert = (state) => state.alert;

export const { setAlert, clearAlert } = actions;
export default reducer;
