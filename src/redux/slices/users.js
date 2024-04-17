import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  addUserAsync,
  deleteUserAsync,
  getUserByIdAsync,
  getUsersAsync,
  updateUserAsync,
} from '../services';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  users: [],
  userById: {},
  totalCount: 0,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,

  extraReducers: (builder) => {
    // Get Users ----------
    builder.addMatcher(isAnyOf(getUsersAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getUsersAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.data?.totalItems;
      state.users = payload?.data?.data;
    });
    builder.addMatcher(isAnyOf(getUsersAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.users = [];
    });
    // -------------

    // Get staff ----------
    builder.addMatcher(isAnyOf(getUserByIdAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getUserByIdAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.userById = payload?.data;
    });
    builder.addMatcher(isAnyOf(getUserByIdAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.userById = {};
    });
    // -------------

    // Add User ----------
    builder.addMatcher(isAnyOf(addUserAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(addUserAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(addUserAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Update User ----------
    builder.addMatcher(isAnyOf(updateUserAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateUserAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateUserAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Delete User ----------
    builder.addMatcher(isAnyOf(deleteUserAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deleteUserAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deleteUserAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });
    // -------------
  },
});

export const { clearAlert } = usersSlice.actions;
export default usersSlice.reducer;
