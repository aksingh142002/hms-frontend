import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { postRouteAsync, getRouteListAsync } from '../services';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  routeData: [],
  totalCount: 0,
};

const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    emptyRoute: () => initialState,
  },
  extraReducers: (builder) => {
    // Get Route ----------
    builder.addMatcher(isAnyOf(getRouteListAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getRouteListAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.count;
      state.routeData = payload?.data;
    });
    builder.addMatcher(isAnyOf(getRouteListAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.routeData = [];
    });
    // -------------

    // Add Route ----------
    builder.addMatcher(isAnyOf(postRouteAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(postRouteAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(postRouteAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------
  },
});

export const { emptyRoute } = routeSlice.actions;
export default routeSlice.reducer;
