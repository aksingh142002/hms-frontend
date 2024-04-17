import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { postTestimonialAsync, getTestimonialListAsync, getTestimonialByIdAsync, updateTestimonialAsync, deleteTestimonialAsync } from '@redux/services/testimonialService';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  totalCount: 0,
  postTestimonial: [],
  allTestimonialData: [],
  testimonialById: [],
  updateTestimonialData: [],
};

const testimonialSlice = createSlice({
  name: 'testimonialSlice',
  initialState,
  reducers: {
    emptyCreateTestimonial: () => initialState,
  },
  extraReducers: (builder) => {
  
    // POST
    builder.addMatcher(isAnyOf(postTestimonialAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(postTestimonialAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.postTestimonial = payload;
    });
    builder.addMatcher(isAnyOf(postTestimonialAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.postTestimonial = [];
    });

    // GET
    builder.addMatcher(isAnyOf(getTestimonialListAsync.pending), (state, { payload }) => {
        state.isLoading = true;
      });
      builder.addMatcher(isAnyOf(getTestimonialListAsync.fulfilled), (state, { payload }) => {
        state.isLoading = false;
        state.totalCount = payload?.data?.totalItems;
        state.allTestimonialData = payload?.data?.testimonials;
      });
      builder.addMatcher(isAnyOf(getTestimonialListAsync.rejected), (state, { payload }) => {
        state.isLoading = false;
        state.allTestimonialData = [];
      });

      // GET By Id
    builder.addMatcher(isAnyOf(getTestimonialByIdAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getTestimonialByIdAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.testimonialById = payload?.data;
    });
    builder.addMatcher(isAnyOf(getTestimonialByIdAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.testimonialById = {};
    });
      
    // PUT
    builder.addMatcher(isAnyOf(updateTestimonialAsync.pending), (state, { payload }) => {
        state.isSubmitting = true;
      });
      builder.addMatcher(isAnyOf(updateTestimonialAsync.fulfilled), (state, { payload }) => {
        state.isSubmitting = false;
        state.updateTestimonialData = payload;
      });
      builder.addMatcher(isAnyOf(updateTestimonialAsync.rejected), (state, { payload }) => {
        state.isSubmitting = false;
        state.updateTestimonialData = [];
      });
  
      // DELETE
      builder.addMatcher(isAnyOf(deleteTestimonialAsync.pending), (state, { payload }) => {
        state.isDeleting = true;
      });
      builder.addMatcher(isAnyOf(deleteTestimonialAsync.fulfilled), (state, { payload }) => {
        state.isDeleting = false;
      });
      builder.addMatcher(isAnyOf(deleteTestimonialAsync.rejected), (state, { payload }) => {
        state.isDeleting = false;
      });
  },
});

export const { emptyCreateTestimonial } = testimonialSlice.actions;
export default testimonialSlice.reducer;
