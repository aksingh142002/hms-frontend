import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  postScheduleCreateAsync,
  deleteScheduleAsync,
  getScheduleListAsync,
  getTimeSlotByStaffAsync,
  updateScheduleAsync,
  getScheduleByIdAsync,
} from '../services';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  scheduleData: [],
  scheduleById: {},
  totalCount: 0,
  timeSlot: [],
};

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    emptySchedule: () => initialState,
  },
  extraReducers: (builder) => {


    // Get Schedule ----------
    builder.addMatcher(isAnyOf(getScheduleListAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getScheduleListAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.data?.totalItems;
      state.scheduleData = payload?.data?.data;
    });
    builder.addMatcher(isAnyOf(getScheduleListAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.scheduleData = [];
    });
    // -------------

    // Get Schedule By Id ----------
    builder.addMatcher(isAnyOf(getScheduleByIdAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getScheduleByIdAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.scheduleById = payload?.data;
    });
    builder.addMatcher(isAnyOf(getScheduleByIdAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.scheduleById = {};
    });
    // -------------

    // Get Schedule  ----------
    builder.addMatcher(isAnyOf(getTimeSlotByStaffAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getTimeSlotByStaffAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.timeSlot = payload?.data;
    });
    builder.addMatcher(isAnyOf(getTimeSlotByStaffAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.timeSlot = [];
    });
    // -------------

    // Add Schedule ----------
    builder.addMatcher(isAnyOf(postScheduleCreateAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(postScheduleCreateAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(postScheduleCreateAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Update Schedule ----------
    builder.addMatcher(isAnyOf(updateScheduleAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateScheduleAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateScheduleAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Delete Schedule ----------
    builder.addMatcher(isAnyOf(deleteScheduleAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deleteScheduleAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deleteScheduleAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });
    // -------------
  },
});

export const { emptySchedule } = scheduleSlice.actions;
export default scheduleSlice.reducer;
