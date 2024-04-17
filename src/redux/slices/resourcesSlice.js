import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  postResourcesCreateAsync,
  deleteResourcesAsync,
  getResourcesListAsync,
  updateResourcesAsync,
  getResourcesByIdAsync,
} from '../services/resourcesService';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  resourcesData: [],
  resourcesById: {},
  totalCount: 0,
  allResourcesByResourcesId: [],
  assignedResourcesByResourcesId: [],
};

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    emptyResources: () => initialState,
  },
  extraReducers: (builder) => {


    // Get resources ----------
    builder.addMatcher(isAnyOf(getResourcesListAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getResourcesListAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.resourcesData = payload?.data?.data;
      state.totalCount = payload?.data?.totalItems;
    });
    builder.addMatcher(isAnyOf(getResourcesListAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.resourcesData = [];
    });
    // -------------

    // Get resources By Id ----------
    builder.addMatcher(isAnyOf(getResourcesByIdAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getResourcesByIdAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.resourcesById = payload?.data;
    });
    builder.addMatcher(isAnyOf(getResourcesByIdAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.resourcesById = {};
    });
    // -------------

    // Add Resources ----------
    builder.addMatcher(isAnyOf(postResourcesCreateAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(postResourcesCreateAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(postResourcesCreateAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Update Resources ----------
    builder.addMatcher(isAnyOf(updateResourcesAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateResourcesAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateResourcesAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Delete Resources ----------
    builder.addMatcher(isAnyOf(deleteResourcesAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deleteResourcesAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deleteResourcesAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });
    // -------------
  },
});

export const { emptyResources } = resourcesSlice.actions;
export default resourcesSlice.reducer;