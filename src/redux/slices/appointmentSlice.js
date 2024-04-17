import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { getAppointmentListAsync } from '@redux/services';

const initialState = {
    isLoading: false,
    isSubmitting: false,
    isDeleting: false,
    AllAppointment: [],
    totalCount: 0,
  };
  
  const appointmentSlice = createSlice({
    name: 'Appointment',
    initialState,
    reducers: {
        emptyAppointment: () => initialState,
      },
    extraReducers: (builder) => {
      // Get Appointment ----------
      builder.addMatcher(isAnyOf(getAppointmentListAsync.pending), (state, { payload }) => {
        state.isLoading = true;
      });
      builder.addMatcher(isAnyOf(getAppointmentListAsync.fulfilled), (state, { payload }) => {
        state.isLoading = false;
        state.totalCount = payload?.data?.totalItems;
        state.AllAppointment = payload?.data?.appointment;
      });
      builder.addMatcher(isAnyOf(getAppointmentListAsync.rejected), (state, { payload }) => {
        state.isLoading = false;
        state.AllAppointment = [];
      });
      // -------------
    // -------------
},
});

export const { emptyAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;