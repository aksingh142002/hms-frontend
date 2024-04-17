import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  getFAQAsync,
  addFAQAsync,
  updateFAQAsync,
  deleteFAQAsync,
  getFAQByIdAsync,
} from '../services';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  AllFAQ: [],
  FAQById: {},
};

const faqSlice = createSlice({
  name: 'faq',
  initialState,
  reducers: {
    emptyFAQ: () => initialState,
  },
  extraReducers: (builder) => {
    // Get FAQ ----------
    builder.addMatcher(isAnyOf(getFAQAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getFAQAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.data?.totalItems;
      state.AllFAQ = payload?.data?.FAQ;
    });
    builder.addMatcher(isAnyOf(getFAQAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.AllFAQ = [];
    });
    // -------------

    // Get FAQ By Id ----------
    builder.addMatcher(isAnyOf(getFAQByIdAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getFAQByIdAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.FAQById = payload?.data;
    });
    builder.addMatcher(isAnyOf(getFAQByIdAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.FAQById = {};
    });
    // -------------

    // Add FAQ ----------
    builder.addMatcher(isAnyOf(addFAQAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(addFAQAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(addFAQAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Update FAQ ----------
    builder.addMatcher(isAnyOf(updateFAQAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateFAQAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateFAQAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Delete FAQ ----------
    builder.addMatcher(isAnyOf(deleteFAQAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deleteFAQAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deleteFAQAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });
    // -------------
  },
});

export const { emptyFAQ } = faqSlice.actions;
export default faqSlice.reducer;
