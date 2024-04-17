import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  postCouponCreateAsync,
  deleteCouponAsync,
  getCouponListAsync,
  updateCouponAsync,
  getCouponByIdAsync,
} from '../services';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  couponData: [],
  couponById: {},
  totalCount: 0,
};

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    emptyCoupon: () => initialState,
  },
  extraReducers: (builder) => {


    // Get Coupon ----------
    builder.addMatcher(isAnyOf(getCouponListAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getCouponListAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.data?.totalItems;
      state.couponData = payload?.data?.data;
    });
    builder.addMatcher(isAnyOf(getCouponListAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.couponData = [];
    });
    // -------------

    // Get Coupon By Id ----------
    builder.addMatcher(isAnyOf(getCouponByIdAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getCouponByIdAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.couponById = payload?.data;
    });
    builder.addMatcher(isAnyOf(getCouponByIdAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.couponById = {};
    });
    // -------------

    // Add Coupon ----------
    builder.addMatcher(isAnyOf(postCouponCreateAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(postCouponCreateAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(postCouponCreateAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Update Coupon ----------
    builder.addMatcher(isAnyOf(updateCouponAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateCouponAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateCouponAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Delete Coupon ----------
    builder.addMatcher(isAnyOf(deleteCouponAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deleteCouponAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deleteCouponAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });
    // -------------
  },
});

export const { emptyCoupon } = couponSlice.actions;
export default couponSlice.reducer;
