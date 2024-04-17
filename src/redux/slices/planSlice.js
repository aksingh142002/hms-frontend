import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  postPlanCreateAsync,
  deletePlanAsync,
  getAllPlanListAsync,
  updatePlanAsync,
  getPlanByIdAsync,
  getPlanByUserIdAsync,
  postDailyRoutineAsync,
  getRoutineByUserIdAsync,
  postDailyReportAsync,
  getDietUserReportAsync
} from '../services';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  planData: [],
  planById: {},
  planByUser: [],
  RoutineData: {},
  totalCount: 0,
  getDailyReport: [],
  getDietUserReport : [],
};

const PlanSlice = createSlice({
  name: 'Plan',
  initialState,
  reducers: {
    emptyPlan: () => initialState,
  },
  extraReducers: (builder) => {
    // Get Plan ----------
    builder.addMatcher(isAnyOf(getAllPlanListAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getAllPlanListAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.data?.totalData;
      state.planData = payload?.data?.data;
    });
    builder.addMatcher(isAnyOf(getAllPlanListAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.planData = [];
    });
    // -------------

    // Get Plan By Id ----------
    builder.addMatcher(isAnyOf(getPlanByIdAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getPlanByIdAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.planById = payload?.data;
    });
    builder.addMatcher(isAnyOf(getPlanByIdAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.planById = {};
    });
    // -------------

    // Get Plan By user Id ----------
    builder.addMatcher(isAnyOf(getPlanByUserIdAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getPlanByUserIdAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.planByUser = payload?.data;
    });
    builder.addMatcher(isAnyOf(getPlanByUserIdAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.planByUser = [];
    });
    // -------------

    // Add Plan ----------
    builder.addMatcher(isAnyOf(postPlanCreateAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(postPlanCreateAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(postPlanCreateAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Update Plan ----------
    builder.addMatcher(isAnyOf(updatePlanAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updatePlanAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updatePlanAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Delete Plan ----------
    builder.addMatcher(isAnyOf(deletePlanAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deletePlanAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deletePlanAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });
    // -------------

    // Add Daily Routine ----------
    builder.addMatcher(isAnyOf(postDailyRoutineAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(postDailyRoutineAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(postDailyRoutineAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Get Routine By user Id ----------
    builder.addMatcher(isAnyOf(getRoutineByUserIdAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getRoutineByUserIdAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.RoutineData = payload?.data[0];
    });
    builder.addMatcher(isAnyOf(getRoutineByUserIdAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.RoutineData = {};
    });
    // -------------


    // Get daily report API --------------
    builder.addMatcher(isAnyOf(postDailyReportAsync.pending), (state, { payload }) =>
    {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(postDailyReportAsync.fulfilled), (state, { payload }) =>
    {
      state.isLoading = false;
      state.getDailyReport = payload?.data;
    });
    builder.addMatcher(isAnyOf(postDailyReportAsync.rejected), (state, { payload }) =>
    {
      state.isLoading = false;
      state.getDailyReport = {};
    });


    // diet plan user service and plan report
    builder.addMatcher(isAnyOf(getDietUserReportAsync.pending), (state, { payload }) =>
    {
      state.isLoad = true;
    });
    builder.addMatcher(isAnyOf(getDietUserReportAsync.fulfilled), (state, { payload }) =>
    {
      state.isLoad = false;
      state.getDietUserReport = payload?.data;
    });
    builder.addMatcher(isAnyOf(getDietUserReportAsync.rejected), (state, { payload }) =>
    {
      state.isLoad = false;
      state.getDietUserReport = {};
    });
  },
});

export const { emptyPlan } = PlanSlice.actions;
export default PlanSlice.reducer;
