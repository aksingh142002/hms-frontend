import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { postLoginAsync, postLogoutAsync } from '../services';

const initialState = {
  isLoading: false,
  totalCount: 0,
};

const loginSlice = createSlice({
  name: 'loginSlice',
  initialState,

  extraReducers: (builder) => {
  
    // Add Course ----------
    builder.addMatcher(isAnyOf(postLoginAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(postLoginAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.login = payload;
    });
    builder.addMatcher(isAnyOf(postLoginAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.login = [];
    });

    // Add Course ----------
    builder.addMatcher(isAnyOf(postLogoutAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(postLogoutAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      // state.login = payload;
    });
    builder.addMatcher(isAnyOf(postLogoutAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      // state.login = [];
    });
  },
});

export const { clearAlert } = loginSlice.actions;
export default loginSlice.reducer;
