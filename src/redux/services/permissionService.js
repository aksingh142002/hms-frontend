import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getPermissionByIdAsync = createAsyncThunk(
  'master/getPermissionByIdAsync',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/master/get-permission/${id}`,
      method: 'get',
    })
);

export const postPermissionAsync = createAsyncThunk('master/postPermissionAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/master/create-permission',
    method: 'post',
    data,
  })
);
