import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { getSymptomAsync } from '@redux/services';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  AllSymptom: [],
};

const SymptomSlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    emptySymptom: () => initialState,
  },
  extraReducers: (builder) => {
    // Get Users ----------
    builder.addMatcher(isAnyOf(getSymptomAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getSymptomAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.data?.totalItems;
      state.AllSymptom = payload?.data?.data;
    });
    builder.addMatcher(isAnyOf(getSymptomAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.AllSymptom = [];
    });
},
});

export const { emptySymptom } = SymptomSlice.actions;
export default SymptomSlice.reducer;
