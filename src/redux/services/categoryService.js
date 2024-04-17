import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getCategoryAsync = createAsyncThunk(
    'category/getCategoryAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/master/list-category',
    method: 'get',
    params,
  })
);

export const addCategoryAsync = createAsyncThunk('category/addCategoryAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/master/create-category',
    method: 'post',
    data,
  })
);

export const updateCategoryAsync = createAsyncThunk(
  'category/updateCategoryAsync',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/master/update-category/${id}`,
      method: 'put',
      data,
    })
);

export const deleteCategoryAsync = createAsyncThunk(
    'category/deleteCategoryAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/master/delete-category/${id}`,
    method: 'delete',
  })
);
