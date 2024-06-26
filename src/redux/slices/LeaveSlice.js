import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  getLeaveListAsync,
  getLeaveListByStudentIdAsync,
  postLeaveCreateAsync,
  updateLeaveAsync,
  updateLeaveStatusAsync,
  deleteLeaveAsync,
} from '../services';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  totalCount: 0,
  allLeaveData: [],
  LeaveByStudentId: [],
};

const LeaveSlice = createSlice({
  name: 'LeaveSlice',
  initialState,
  reducers: {
    emptyCreateLeave: () => initialState,
  },
  extraReducers: (builder) => {
    // POST
    builder.addMatcher(isAnyOf(postLeaveCreateAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(postLeaveCreateAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
    });
    builder.addMatcher(isAnyOf(postLeaveCreateAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
    });

    // GET
    builder.addMatcher(isAnyOf(getLeaveListAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getLeaveListAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.data?.totalItems;
      state.allLeaveData = payload?.data?.leaveList;
    });
    builder.addMatcher(isAnyOf(getLeaveListAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.allLeaveData = [];
    });

    // GET
    builder.addMatcher(isAnyOf(getLeaveListByStudentIdAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getLeaveListByStudentIdAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.data?.totalItems;
      state.LeaveByStudentId = payload?.data?.leaveList;
    });
    builder.addMatcher(isAnyOf(getLeaveListByStudentIdAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.LeaveByStudentId = [];
    });

    // PUT
    builder.addMatcher(isAnyOf(updateLeaveAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateLeaveAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateLeaveAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });

    // PUT Status
    builder.addMatcher(isAnyOf(updateLeaveStatusAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateLeaveStatusAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateLeaveStatusAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });

    // DELETE
    builder.addMatcher(isAnyOf(deleteLeaveAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deleteLeaveAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deleteLeaveAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });
  },
});

export const { emptyCreateLeave } = LeaveSlice.actions;
export default LeaveSlice.reducer;
