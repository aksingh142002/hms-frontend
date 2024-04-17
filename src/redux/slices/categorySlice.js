import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { getCategoryAsync,addCategoryAsync,updateCategoryAsync,deleteCategoryAsync } from '../services/categoryService';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  AllCategory: [],
};

const CategorySlice = createSlice({
  name: 'category',
  initialState,

  extraReducers: (builder) => {
    // Get Users ----------
    builder.addMatcher(isAnyOf(getCategoryAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getCategoryAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.data?.totalItems;
      state.AllCategory = payload?.data?.data;
    });
    builder.addMatcher(isAnyOf(getCategoryAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.AllCategory = [];
    });
    // -------------

    // Add User ----------
    builder.addMatcher(isAnyOf(addCategoryAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(addCategoryAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(addCategoryAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Update User ----------
    builder.addMatcher(isAnyOf(updateCategoryAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateCategoryAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateCategoryAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Delete User ----------
    builder.addMatcher(isAnyOf(deleteCategoryAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deleteCategoryAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deleteCategoryAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });
    // -------------
  },
});

export const { clearAlert } = CategorySlice.actions;
export default CategorySlice.reducer;
