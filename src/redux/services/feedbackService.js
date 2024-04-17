import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getFeedbackListAsync = createAsyncThunk(
    'feedback/getFeedbackListAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/feedback/get-all-feedback',
    method: 'get',
    params,
  })
);


export const getPlanFeedbackByIdAsync = createAsyncThunk(
  'feedback/getPlanFeedbackByIdAsync', async (params, toolkit) =>
AxiosClient({
  toolkit,
  url: '/rating/getfeedback-rating-admin',
  method: 'get',
  params,
})
);
