import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { getDashboardAsync } from '@redux/services';

const initialState = {
  isLoading: false,
  dashboardData: {},
};

const DashboardSlice = createSlice({
  name: 'Dashboard',
  initialState,
  reducers: {
    emptyDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    // Get Users ----------
    builder.addMatcher(isAnyOf(getDashboardAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getDashboardAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.dashboardData = payload?.data;
    });
    builder.addMatcher(isAnyOf(getDashboardAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
    });
},
});

export const { emptyDashboard } = DashboardSlice.actions;
export default DashboardSlice.reducer;
