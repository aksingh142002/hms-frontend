import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getLeaveListAsync = createAsyncThunk(
  'leave/getLeaveListAsync',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/leave/list-leave',
      method: 'get',
      params,
    })
);

export const postLeaveCreateAsync = createAsyncThunk('leave/addLeaveAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/leave/create-leave',
    method: 'post',
    data,
  })
);

export const updateLeaveAsync = createAsyncThunk(
  'leave/updateLeaveAsync',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/leave/update-leave/${id}`,
      method: 'put',
      data,
    })
);

export const updateLeaveStatusAsync = createAsyncThunk(
  'leave/updateLeaveStatusAsync',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/leave/update-leave-status/${id}`,
      method: 'put',
      data,
    })
);
export const deleteLeaveAsync = createAsyncThunk('leave/deleteLeaveAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/leave/delete-leave/${id}`,
    method: 'delete',
  })
);
