import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';
import axios from 'axios';
import { HOST_API_KEY } from '../../config-global';

export const getuserReportAsync = createAsyncThunk(
  'userReport/getuserReportAsync',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/user-report/list-report',
      method: 'get',
      params, 
    })
);

export const adduserReportAsync = createAsyncThunk('userReport/adduserReportAsync', async (formData, toolkit) =>
    axios.post(`${HOST_API_KEY}user-report/create-report`, formData, {
  headers: {
    'content-type': 'multipart/form-data',
    Authorization: `${localStorage?.getItem('token')}`,
  },
})
);

export const updateuserReportAsync = createAsyncThunk(
  'userReport/updateuserReportAsync',
  async ({ id, data }, toolkit) =>
  axios.put(`${HOST_API_KEY}user-report/update-report/${id}`, data, {
    headers: {
      'content-type': 'multipart/form-data',
      Authorization: `${localStorage?.getItem('token')}`,
    },
  })
);

export const deleteuserReportAsync = createAsyncThunk('userReport/deleteuserReportAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/user-report/delete-report/${id}`,
    method: 'delete',
  })
);

export const getUserReportListAsync = createAsyncThunk(
  'userReport/getUserReporListtAsync',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/user-report/get-report/${id}`,
      method: 'get',
    })
);
