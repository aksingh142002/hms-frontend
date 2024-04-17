import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getAppointmentListAsync = createAsyncThunk(
    'appointment/getAppointmentListAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/appointment/getall-appointment',
    method: 'get',
    params,
  })
);

export const postAppointmentCreateAsync = createAsyncThunk(
  'appointment/postAppointmentCreateAsync',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/appointment/create-appointment',
      method: 'post',
      data,
    })
);