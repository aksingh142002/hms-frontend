import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  postStudentCreateAsync,
  deleteStudentAsync,
  getStudentListAsync,
  updateStudentAsync,
  getStudentByIdAsync,
} from '../services/studentService';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  StudentData: [],
  StudentById: {},
  totalCount: 0,
  allStudentByStudentId: [],
  assignedStudentByStudentId: [],
};

const StudentSlice = createSlice({
  name: 'Student',
  initialState,
  reducers: {
    emptyStudent: () => initialState,
  },
  extraReducers: (builder) => {


    // Get Student ----------
    builder.addMatcher(isAnyOf(getStudentListAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getStudentListAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.data?.totalItems;
      state.StudentData = payload?.data?.data;
    });
    builder.addMatcher(isAnyOf(getStudentListAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.StudentData = [];
    });
    // -------------

    // Get Student By Id ----------
    builder.addMatcher(isAnyOf(getStudentByIdAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getStudentByIdAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.StudentById = payload?.data;
    });
    builder.addMatcher(isAnyOf(getStudentByIdAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.StudentById = {};
    });
    // -------------

    // Add Student ----------
    builder.addMatcher(isAnyOf(postStudentCreateAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(postStudentCreateAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(postStudentCreateAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Update Student ----------
    builder.addMatcher(isAnyOf(updateStudentAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateStudentAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateStudentAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });

    // Delete Student ----------
    builder.addMatcher(isAnyOf(deleteStudentAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deleteStudentAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deleteStudentAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });
    // -------------
  },
});

export const { emptyStudent } = StudentSlice.actions;
export default StudentSlice.reducer;
