import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getFAQAsync = createAsyncThunk('FAQ/getFAQAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/FAQ/list-FAQ',
    method: 'get',
    params,
  })
);

export const getFAQByIdAsync = createAsyncThunk('FAQ/getFAQByIdAsync', async ({ id }, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/FAQ/get-FAQ/${id}`,
    method: 'get',
  })
);

export const addFAQAsync = createAsyncThunk('FAQ/addFAQAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/FAQ/create-FAQ',
    method: 'post',
    data,
  })
);

export const updateFAQAsync = createAsyncThunk(
  'FAQ/updateFAQAsync',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/FAQ/update-FAQ/${id}`,
      method: 'put',
      data,
    })
);

export const deleteFAQAsync = createAsyncThunk('FAQ/deleteFAQAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/FAQ/delete-FAQ/${id}`,
    method: 'delete',
  })
);
