import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  postDietPlanCreateAsync,
  deleteDietPlanAsync,
  getAllDietPlanListAsync,
  updateDietPlanAsync,
  getDietPlanByIdAsync,
  postDietPlanNotesAsync,
  getDietPlanNotesAsync,
  getDietUserReportAsync,
} from '../services';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  dietPlanData: [],
  dietPlanById: {},
  totalCount: 0,
  allDietPlanByDietPlanId: [],
  assignedDietPlanByDietPlanId: [],
  addNotesDietPlan: [],
  getDietPlanNotes: [],
  getDietUserReport : [],
};

const dietPlanSlice = createSlice({
  name: 'dietPlan',
  initialState,
  reducers: {
    emptyDietPlan: () => initialState,
  },
  extraReducers: (builder) => {
    // Get dietPlan ----------
    builder.addMatcher(isAnyOf(getAllDietPlanListAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getAllDietPlanListAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.data?.totalData;
      state.dietPlanData = payload?.data?.diet;
    });
    builder.addMatcher(isAnyOf(getAllDietPlanListAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.dietPlanData = [];
    });
    // -------------

    // Get dietPlan By Id ----------
    builder.addMatcher(isAnyOf(getDietPlanByIdAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getDietPlanByIdAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.dietPlanById = payload?.data;
    });
    builder.addMatcher(isAnyOf(getDietPlanByIdAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.dietPlanById = {};
    });
    // -------------

    // Add DietPlan ----------
    builder.addMatcher(isAnyOf(postDietPlanCreateAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(postDietPlanCreateAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(postDietPlanCreateAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Update DietPlan ----------
    builder.addMatcher(isAnyOf(updateDietPlanAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateDietPlanAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateDietPlanAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Delete DietPlan ----------
    builder.addMatcher(isAnyOf(deleteDietPlanAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deleteDietPlanAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deleteDietPlanAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });
    // -------------

    // Add notes to diet plan
    builder.addMatcher(isAnyOf(postDietPlanNotesAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(postDietPlanNotesAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(postDietPlanNotesAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });

    // Get notes from diet plan
    builder.addMatcher(isAnyOf(getDietPlanNotesAsync.pending), (state, { payload }) => {
      state.isLoad = true;
    });
    builder.addMatcher(isAnyOf(getDietPlanNotesAsync.fulfilled), (state, { payload }) => {
      state.isLoad = false;
      state.getDietPlanNotes = payload?.data;
    });
    builder.addMatcher(isAnyOf(getDietPlanNotesAsync.rejected), (state, { payload }) => {
      state.isLoad = false;
      state.getDietPlanNotes = {};
    });
  },
});

export const { emptyDietPlan } = dietPlanSlice.actions;
export default dietPlanSlice.reducer;
