import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  getbloodReportAsync,
  getbloodReportByIdAsync,
  addBloodReportAsync,
  updateBloodReportAsync,
  deletebloodReportAsync,
} from '../services/bloodReportService';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  bloodData: [],
  bloodDataById: [],
  totalCount: 0,
};

const bloodReportSlice = createSlice({
  name: 'bloodReport',
  initialState,

  extraReducers: (builder) => {
    // Get Blood Report ----------
    builder.addMatcher(isAnyOf(getbloodReportAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getbloodReportAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.data?.totalItems;
      state.bloodData = payload?.data?.bloodData;
    });
    builder.addMatcher(isAnyOf(getbloodReportAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.bloodData = [];
    });
    // -------------

    // Get Blood Report ----------
    builder.addMatcher(isAnyOf(getbloodReportByIdAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getbloodReportByIdAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      // state.totalCount = payload?.data?.totalItems;
      state.bloodDataById = payload?.data;
    });
    builder.addMatcher(isAnyOf(getbloodReportByIdAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.bloodDataById = [];
    });
    // -------------

    // Add Blood Report ----------
    builder.addMatcher(isAnyOf(addBloodReportAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(addBloodReportAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(addBloodReportAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Update Blood Report ----------
    builder.addMatcher(isAnyOf(updateBloodReportAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateBloodReportAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateBloodReportAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Delete Blood Report ----------
    builder.addMatcher(isAnyOf(deletebloodReportAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deletebloodReportAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deletebloodReportAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });
    // -------------
  },
});

export const { clearAlert } = bloodReportSlice.actions;
export default bloodReportSlice.reducer;
