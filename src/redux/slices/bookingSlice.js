import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  getBookingListAsync,
  getPlanExpiryAsync,
  getBookingByIdAsync,
  updatePlanExpiryAsync,
  putAssignStaffAsync,
  updateOrderScheduleAsync,
} from '@redux/services';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  AllBooking: [],
  BookingById: [],
  PlanExpiry: [],
};

const bookingSlice = createSlice({
  name: 'Booking',
  initialState,
  reducers: {
    emptyBooking: () => initialState,
  },
  extraReducers: (builder) => {
    // Get Booking ----------
    builder.addMatcher(isAnyOf(getBookingListAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getBookingListAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.data?.totalItems;
      state.AllBooking = payload?.data?.data;
    });
    builder.addMatcher(isAnyOf(getBookingListAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.AllBooking = [];
    });
    // -------------

    // Get Booking Expiry----------
    builder.addMatcher(isAnyOf(getPlanExpiryAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getPlanExpiryAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.data?.totalItem;
      state.PlanExpiry = payload?.data?.expiryPlan;
    });
    builder.addMatcher(isAnyOf(getPlanExpiryAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.PlanExpiry = [];
    });
    // -------------

    // Get Booking by ID ----------
    builder.addMatcher(isAnyOf(getBookingByIdAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getBookingByIdAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.BookingById = payload?.data;
    });
    builder.addMatcher(isAnyOf(getBookingByIdAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.BookingById = [];
    });
    // -------------

    // Update Plan Assign----------
    builder.addMatcher(isAnyOf(putAssignStaffAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(putAssignStaffAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(putAssignStaffAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Update Order Schedule ----------
    builder.addMatcher(isAnyOf(updateOrderScheduleAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateOrderScheduleAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateOrderScheduleAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Update Plan Expiry ----------
    builder.addMatcher(isAnyOf(updatePlanExpiryAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updatePlanExpiryAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updatePlanExpiryAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // -------------
  },
});

export const { emptyBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
