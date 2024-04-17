import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getDashboardAsync = createAsyncThunk(
    'dashboard/getDashboardAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/dashboard/get-dashboard',
    method: 'get',
    params,
  })
);
