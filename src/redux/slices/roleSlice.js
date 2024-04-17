import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { getRoleListAsync, postRoleAsync, updateRoleAsync, deleteRoleAsync } from '../services';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  totalCount: 0,
  postRole: [],
  allRoleData: [],
  updateRoleData: [],
};

const roleSlice = createSlice({
  name: 'roleSlice',
  initialState,
  reducers: {
    emptyCreateRole: () => initialState,
  },
  extraReducers: (builder) => {
  
    // POST
    builder.addMatcher(isAnyOf(postRoleAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(postRoleAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.postRole = payload;
    });
    builder.addMatcher(isAnyOf(postRoleAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.postRole = [];
    });

    // GET
    builder.addMatcher(isAnyOf(getRoleListAsync.pending), (state, { payload }) => {
        state.isLoading = true;
      });
      builder.addMatcher(isAnyOf(getRoleListAsync.fulfilled), (state, { payload }) => {
        state.isLoading = false;
        state.totalCount = payload?.data?.totalItems;
        state.allRoleData = payload?.data?.data;
      });
      builder.addMatcher(isAnyOf(getRoleListAsync.rejected), (state, { payload }) => {
        state.isLoading = false;
        state.allRoleData = [];
      });
      
    // PUT
    builder.addMatcher(isAnyOf(updateRoleAsync.pending), (state, { payload }) => {
        state.isSubmitting = true;
      });
      builder.addMatcher(isAnyOf(updateRoleAsync.fulfilled), (state, { payload }) => {
        state.isSubmitting = false;
        state.updateRoleData = payload;
      });
      builder.addMatcher(isAnyOf(updateRoleAsync.rejected), (state, { payload }) => {
        state.isSubmitting = false;
        state.updateRoleData = [];
      });
  
      // DELETE
      builder.addMatcher(isAnyOf(deleteRoleAsync.pending), (state, { payload }) => {
        state.isDeleting = true;
      });
      builder.addMatcher(isAnyOf(deleteRoleAsync.fulfilled), (state, { payload }) => {
        state.isDeleting = false;
      });
      builder.addMatcher(isAnyOf(deleteRoleAsync.rejected), (state, { payload }) => {
        state.isDeleting = false;
      });
  },
});

export const { emptyCreateRole } = roleSlice.actions;
export default roleSlice.reducer;
