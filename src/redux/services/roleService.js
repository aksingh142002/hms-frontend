import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getRoleListAsync = createAsyncThunk(
  'master/getRoleListAsync',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/master/list-role',
      method: 'get',
      params,
    })
);

export const postRoleAsync = createAsyncThunk('master/addRoleAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/master/create-role',
    method: 'post',
    data,
  })
);

export const updateRoleAsync = createAsyncThunk(
  'master/updateRoleAsync',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/master/update-role/${id}`,
      method: 'put',
      data,
    })
);

export const deleteRoleAsync = createAsyncThunk('master/deleteRoleAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/master/delete-role/${id}`,
    method: 'delete',
  })
);
