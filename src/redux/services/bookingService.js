import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getBookingListAsync = createAsyncThunk(
  'booking/getBookingListAsync',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/order/get-all-orders',
      method: 'get',
      params,
    })
);

export const getPlanExpiryAsync = createAsyncThunk(
  'booking/get10DaysExpiryAsync',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/order/planExpiresTen',
      method: 'get',
      params,
    })
);

export const getBookingByIdAsync = createAsyncThunk(
  'booking/getBookingByIdAsync',
  async ({ id }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/order/get-orders/${id}`,
      method: 'get',
    })
);

export const putAssignStaffAsync = createAsyncThunk(
  'booking/putAssignStaffAsync',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/order/assign-staff',
      method: 'put',
      data,
    })
);

export const updateOrderScheduleAsync = createAsyncThunk('order/updateOrderScheduleAsync', async ({id, data}, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/order/reschedules/${id}`,
    method: 'put',
    data,
  })
);

export const updatePlanExpiryAsync = createAsyncThunk('order/updatePlanExpiryAsync', async ({id, data}, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/order/extend-expiry-date/${id}`,
    method: 'put',
    data,
  })
);

