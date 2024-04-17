import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  postStaffCreateAsync,
  deleteStaffAsync,
  getStaffListAsync,
  updateStaffAsync,
  getStaffByIdAsync,
  getStaffDocOrNutrAsync,
  getStaffDocAsync,
  getStaffNutAsync,
  appointmentRescheduleAsync
} from '../services';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  staffDocOrNut: [],
  staffDoc: [],
  staffNut: [],
  staffData: [],
  staffById: {},
  totalCount: 0,
  appointmentReschedule : []
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    emptyStaff: () => initialState,
  },
  extraReducers: (builder) => {
    // Get staff ----------
    builder.addMatcher(isAnyOf(getStaffListAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getStaffListAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.data?.totalItems;
      state.staffData = payload?.data?.data;
    });
    builder.addMatcher(isAnyOf(getStaffListAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.staffData = [];
    });
    // -------------
    // Get staff Doctor or Nutritionist ----------
    builder.addMatcher(isAnyOf(getStaffDocOrNutrAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getStaffDocOrNutrAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.staffDocOrNut = payload?.data;
    });
    builder.addMatcher(isAnyOf(getStaffDocOrNutrAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.staffDocOrNut = [];
    });
    // Get staff Doctor ----------
    builder.addMatcher(isAnyOf(getStaffDocAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getStaffDocAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.staffDoc = payload?.data;
    });
    builder.addMatcher(isAnyOf(getStaffDocAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.staffDoc = [];
    });
    // Get staff Nutritionist ----------
    builder.addMatcher(isAnyOf(getStaffNutAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getStaffNutAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.staffNut = payload?.data;
    });
    builder.addMatcher(isAnyOf(getStaffNutAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.staffNut = [];
    });
    // Get staff By Id ----------
    builder.addMatcher(isAnyOf(getStaffByIdAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getStaffByIdAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.staffById = payload?.data;
    });
    builder.addMatcher(isAnyOf(getStaffByIdAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.staffById = {};
    });
    // -------------

    // Add Staff ----------
    builder.addMatcher(isAnyOf(postStaffCreateAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(postStaffCreateAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(postStaffCreateAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Update Staff ----------
    builder.addMatcher(isAnyOf(updateStaffAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateStaffAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateStaffAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Delete Staff ----------
    builder.addMatcher(isAnyOf(deleteStaffAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deleteStaffAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deleteStaffAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });
    // -------------

    // Appointment Resechudule
    builder.addMatcher(isAnyOf(appointmentRescheduleAsync.pending), (state, { payload }) =>
    {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(appointmentRescheduleAsync.fulfilled), (state, { payload }) =>
    {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(appointmentRescheduleAsync.rejected), (state, { payload }) =>
    {
      state.isSubmitting = false;
    });
  },
});

export const { emptyStaff } = staffSlice.actions;
export default staffSlice.reducer;
