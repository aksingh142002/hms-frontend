import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getCalorieByDateAsync = createAsyncThunk(
    'calorietracker/getCalorieByDateAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/plan/get-calorietracker-admin',
    method: 'get',
    params,
  })
);