import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  getuserReportAsync,
  adduserReportAsync,
  updateuserReportAsync,
  deleteuserReportAsync,
  getUserReportListAsync,
} from '../services/userReportService';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  userReport: [],
  totalCount: 0,
  getUserReportList: [],
};

const userReportSlice = createSlice({
  name: 'userReport',
  initialState,

  extraReducers: (builder) => {
    // Get User Report ----------
    builder.addMatcher(isAnyOf(getuserReportAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getuserReportAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.data?.totalItems;
      state.userReport = payload?.data?.userReport;
    });
    builder.addMatcher(isAnyOf(getuserReportAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.userReport = [];
    });
    // -------------

    // Add User Report ----------
    builder.addMatcher(isAnyOf(adduserReportAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(adduserReportAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(adduserReportAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Update User Report ----------
    builder.addMatcher(isAnyOf(updateuserReportAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateuserReportAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateuserReportAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Delete User Report ----------
    builder.addMatcher(isAnyOf(deleteuserReportAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deleteuserReportAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deleteuserReportAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });
    // -------------

    // get user report

    builder.addMatcher(isAnyOf(getUserReportListAsync.pending), (state, { payload }) => {
      state.isLoad = true;
    });
    builder.addMatcher(isAnyOf(getUserReportListAsync.fulfilled), (state, { payload }) => {
      state.isLoad = false;
      state.getUserReportList = payload?.data;
    });
    builder.addMatcher(isAnyOf(getUserReportListAsync.rejected), (state, { payload }) => {
      state.isLoad = false;
      state.getUserReportList = {};
    });
  },
});

export const { clearAlert } = userReportSlice.actions;
export default userReportSlice.reducer;
