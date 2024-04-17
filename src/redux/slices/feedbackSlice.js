import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { getFeedbackListAsync, getPlanFeedbackByIdAsync } from '@redux/services';

const initialState = {
    isLoading: false,
    isSubmitting: false,
    isDeleting: false,
    AllFeedback: [],
    PlanFeedbackById: {},
  };
  
  const feedbackSlice = createSlice({
    name: 'Feedback',
    initialState,
    reducers: {
        emptyFeedback: () => initialState,
      },
    extraReducers: (builder) => {
      // Get Feedback ----------
      builder.addMatcher(isAnyOf(getFeedbackListAsync.pending), (state, { payload }) => {
        state.isLoading = true;
      });
      builder.addMatcher(isAnyOf(getFeedbackListAsync.fulfilled), (state, { payload }) => {
        state.isLoading = false;
        state.totalCount = payload?.data?.totalItems;
        state.AllFeedback = payload?.data?.feedbackData;
      });
      builder.addMatcher(isAnyOf(getFeedbackListAsync.rejected), (state, { payload }) => {
        state.isLoading = false;
        state.AllFeedback = [];
      });
      // -------------

      // Get Plan Feedback ----------
      builder.addMatcher(isAnyOf(getPlanFeedbackByIdAsync.pending), (state, { payload }) => {
        state.isLoading = true;
      });
      builder.addMatcher(isAnyOf(getPlanFeedbackByIdAsync.fulfilled), (state, { payload }) => {
        state.isLoading = false;
        state.PlanFeedbackById = payload?.data?.ratings[0];
      });
      builder.addMatcher(isAnyOf(getPlanFeedbackByIdAsync.rejected), (state, { payload }) => {
        state.isLoading = false;
        state.PlanFeedbackById = [];
      });
      // -------------
    // -------------
},
});

export const { emptyFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;