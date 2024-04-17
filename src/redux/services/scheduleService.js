import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getScheduleListAsync = createAsyncThunk(
  'schedule/getScheduleListAsync',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/schedule/list-schedule',
      method: 'get',
      params,
    })
);

export const getTimeSlotByStaffAsync = createAsyncThunk(
  'schedule/getTimeSlotByStaffAsync',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/schedule/get-staff-time-slots',
      method: 'get',
      params,
    })
);


export const getScheduleByIdAsync = createAsyncThunk('schedule/getScheduleByIdAsync', async ({id}, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/schedule/schedule-byid/${id}`,
    method: 'get',
  })
);

export const postScheduleCreateAsync = createAsyncThunk('schedule/postScheduleCreateAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/schedule/create-schedule',
    method: 'post',
    data,
  })
);

export const updateScheduleAsync = createAsyncThunk(
  'schedule/updateScheduleAsync',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/schedule/update-schedule/${id}`,
      method: 'put',
      data,
    })
);

export const deleteScheduleAsync = createAsyncThunk('schedule/deleteScheduleAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/schedule/delete-schedule/${id}`,
    method: 'delete',
  })
);
