import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { getCalorieByDateAsync } from '@redux/services';

const initialState = {
    isLoading: false,
    isSubmitting: false,
    isDeleting: false,
    calorieData: [],
  };
  
  const CalorieSlice = createSlice({
    name: 'calorietracker',
    initialState,
    reducers: {
        emptyCalorie: () => initialState,
      },
    extraReducers: (builder) => {
      // Get Calorie ----------
      builder.addMatcher(isAnyOf(getCalorieByDateAsync.pending), (state, { payload }) => {
        state.isLoading = true;
      });
      builder.addMatcher(isAnyOf(getCalorieByDateAsync.fulfilled), (state, { payload }) => {
        state.isLoading = false;
        state.calorieData = payload?.data?.calorieData;
      });
      builder.addMatcher(isAnyOf(getCalorieByDateAsync.rejected), (state, { payload }) => {
        state.isLoading = false;
        state.calorieData = [];
      });
      // -------------
    // -------------
},
});

export const { emptyCalorie } = CalorieSlice.actions;
export default CalorieSlice.reducer;