import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  postPermissionAsync,
  getPermissionByIdAsync,
} from '../services';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  permissionById: [],
  totalCount: 0,
};

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    emptyPermission: () => initialState,
  },
  extraReducers: (builder) => {

    // Get Permission By Id ----------
    builder.addMatcher(isAnyOf(getPermissionByIdAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getPermissionByIdAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.permissionById = payload?.data;
    });
    builder.addMatcher(isAnyOf(getPermissionByIdAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.permissionById = [];
    });
    // -------------

    // Add Permission ----------
    builder.addMatcher(isAnyOf(postPermissionAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(postPermissionAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(postPermissionAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------
  },
});

export const { emptyPermission } = permissionSlice.actions;
export default permissionSlice.reducer;
