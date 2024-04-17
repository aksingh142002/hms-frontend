import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getSymptomAsync = createAsyncThunk(
    'symptom/getsymptomAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/master/list-symptoms',
    method: 'get',
    params,
  })
);
