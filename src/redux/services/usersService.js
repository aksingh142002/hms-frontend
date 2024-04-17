import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getUsersAsync = createAsyncThunk('users/getUsersAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/user/list-users',
    method: 'get',
    params,
  })
);

export const getUserByIdAsync = createAsyncThunk('users/getUserByIdAsync', async ({id}, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/user/get-single-user/${id}`,
    method: 'get',
  })
);


export const addUserAsync = createAsyncThunk('users/addUsersAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/users',
    method: 'post',
    data,
  })
);

export const updateUserAsync = createAsyncThunk(
  'users/updateUsersAsync',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/users/${id}`,
      method: 'put',
      data,
    })
);

export const deleteUserAsync = createAsyncThunk('users/deleteUserAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/user/delete-user/${id}`,
    method: 'delete',
  })
);
