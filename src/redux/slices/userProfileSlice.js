import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { getProfileByIdAsync, getPrakritiDataByIdAsync, getAssessmentByIdAsync, updatePakritiByIdAsync } from '../services';

const initialState = {
  isLoading: false,
  isLoadingPrakriti: false,
  isLoadingAssessment: false,
  isSubmitting: false,
  isDeleting: false,
  user: [],
  profileById: {},
  prakritiById: [],
  prakritiPage: 0,
  totalPrakritiPage: 0,
  assessmentById: [],
  assessmentPage: 0,
  totalAssessmentPage: 0,
  totalCount: 0,
};

const userProfileSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    emptyUserProfile: () => initialState,
  },
  extraReducers: (builder) => {
    // Get profileById ----------
    builder.addMatcher(isAnyOf(getProfileByIdAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getProfileByIdAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.profileById = payload?.data?.data;
    });
    builder.addMatcher(isAnyOf(getProfileByIdAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.profileById = {};
    });

    // -------------

    // Get userdataById ----------
    builder.addMatcher(isAnyOf(getPrakritiDataByIdAsync.pending), (state, { payload }) => {
      state.isLoadingPrakriti = true;
    });
    builder.addMatcher(isAnyOf(getPrakritiDataByIdAsync.fulfilled), (state, { payload }) => {
      state.isLoadingPrakriti = false;
      state.prakritiById = payload?.data?.data;
      state.totalPrakritiPage = payload?.data?.totalPages;
      state.prakritiPage = payload?.data?.page;
    });
    builder.addMatcher(isAnyOf(getPrakritiDataByIdAsync.rejected), (state, { payload }) => {
      state.isLoadingPrakriti = false;
      state.prakritiById = [];
      state.totalPrakritiPage = 0;
      state.prakritiPage = 0;
    });

    // -------------

    // PUT
    builder.addMatcher(isAnyOf(updatePakritiByIdAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updatePakritiByIdAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updatePakritiByIdAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });

    // Get assessmentById ----------
    builder.addMatcher(isAnyOf(getAssessmentByIdAsync.pending), (state, { payload }) => {
      state.isLoadingAssessment = true;
    });
    builder.addMatcher(isAnyOf(getAssessmentByIdAsync.fulfilled), (state, { payload }) => {
      state.isLoadingAssessment = false;
      state.assessmentById = payload?.data?.data;
      state.assessmentPage = payload?.data?.currentPage;
      state.totalAssessmentPage = payload?.data?.totalPages;
    });
    builder.addMatcher(isAnyOf(getAssessmentByIdAsync.rejected), (state, { payload }) => {
      state.isLoadingAssessment = false;
      state.assessmentById = [];
      state.assessmentPage = 0;
      state.totalAssessmentPage = 0;
    });

    // -------------
  },
});

export const { emptyUserProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;
