import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  postBannerAsync,
  deleteBannerAsync,
  getAllBannerAsync,
  updateBannerAsync,
  updateBannerStatusAsync,
} from '../services';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  allBannerData: [],
  totalCount: 0,
};

const BannerSlice = createSlice({
  name: 'Banner',
  initialState,
  reducers: {
    emptyBanner: () => initialState,
  },
  extraReducers: (builder) => {
    // Get Banner ----------
    builder.addMatcher(isAnyOf(getAllBannerAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getAllBannerAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.data?.totalItems;
      state.allBannerData = payload?.data?.banners;
    });
    builder.addMatcher(isAnyOf(getAllBannerAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.allBannerData = [];
    });
    // -------------

    // Add Banner ----------
    builder.addMatcher(isAnyOf(postBannerAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(postBannerAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(postBannerAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Update Banner ----------
    builder.addMatcher(isAnyOf(updateBannerAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateBannerAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateBannerAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Update Banner ----------
    builder.addMatcher(isAnyOf(updateBannerStatusAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateBannerStatusAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateBannerStatusAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Delete Banner ----------
    builder.addMatcher(isAnyOf(deleteBannerAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deleteBannerAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deleteBannerAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });
    // -------------
  },
});

export const { emptyBanner } = BannerSlice.actions;
export default BannerSlice.reducer;
