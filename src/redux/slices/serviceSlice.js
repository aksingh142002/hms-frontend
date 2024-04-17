import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  postServiceCreateAsync,
  deleteServiceAsync,
  getServiceListAsync,
  updateBloodServiceAsync,
  getServiceByIdAsync,
} from '../services/service';

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  ServiceData: [],
  ServiceById: {},
  totalCount: 0,
  allServiceByServiceId: [],
  assignedServiceByServiceId: [],
};

const ServiceSlice = createSlice({
  name: 'Service',
  initialState,
  reducers: {
    emptyService: () => initialState,
  },
  extraReducers: (builder) => {


    // Get Service ----------
    builder.addMatcher(isAnyOf(getServiceListAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getServiceListAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.totalCount = payload?.data?.totalItems;
      state.ServiceData = payload?.data?.data;
    });
    builder.addMatcher(isAnyOf(getServiceListAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.ServiceData = [];
    });
    // -------------

    // Get Service By Id ----------
    builder.addMatcher(isAnyOf(getServiceByIdAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(getServiceByIdAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.ServiceById = payload?.data;
    });
    builder.addMatcher(isAnyOf(getServiceByIdAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.ServiceById = {};
    });
    // -------------

    // Add Service ----------
    builder.addMatcher(isAnyOf(postServiceCreateAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(postServiceCreateAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(postServiceCreateAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });
    // -------------

    // Update Service ----------
    builder.addMatcher(isAnyOf(updateBloodServiceAsync.pending), (state, { payload }) => {
      state.isSubmitting = true;
    });
    builder.addMatcher(isAnyOf(updateBloodServiceAsync.fulfilled), (state, { payload }) => {
      state.isSubmitting = false;
    });
    builder.addMatcher(isAnyOf(updateBloodServiceAsync.rejected), (state, { payload }) => {
      state.isSubmitting = false;
    });

    // Delete Service ----------
    builder.addMatcher(isAnyOf(deleteServiceAsync.pending), (state, { payload }) => {
      state.isDeleting = true;
    });
    builder.addMatcher(isAnyOf(deleteServiceAsync.fulfilled), (state, { payload }) => {
      state.isDeleting = false;
    });
    builder.addMatcher(isAnyOf(deleteServiceAsync.rejected), (state, { payload }) => {
      state.isDeleting = false;
    });
    // -------------
  },
});

export const { emptyService } = ServiceSlice.actions;
export default ServiceSlice.reducer;
