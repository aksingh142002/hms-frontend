import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';
import axios from 'axios';
import { HOST_API_KEY } from '../../config-global';

export const postDietPlanCreateAsync = createAsyncThunk(
  'dietPlan/postDietPlanCreateAsync',
  async (formData, toolkit) =>
    axios.post(`${HOST_API_KEY}diet-plan/save-diet`, formData, {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `${localStorage?.getItem('token')}`,
      },
    })
);

export const getAllDietPlanListAsync = createAsyncThunk(
  'dietPlan/getAllDietPlanListAsync',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/diet-plan/list-diet',
      method: 'get',
      params,
    })
);

export const getDietPlanByIdAsync = createAsyncThunk(
  'dietPlan/getDietPlanByIdAsync',
  async ({ id }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/diet-plan/get-diet/${id}`,
      method: 'get',
    })
);

export const updateDietPlanAsync = createAsyncThunk(
  'dietPlan/updateDietPlanAsync',
  async ({ id, data }, toolkit) =>
    axios.put(`${HOST_API_KEY}diet-plan/update-diet/${id}`, data, {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `${localStorage?.getItem('token')}`,
      },
    })
);

export const deleteDietPlanAsync = createAsyncThunk(
  'dietPlan/updateDietPlanAsync',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/diet-plan/delete-diet/${id}`,
      method: 'delete',
    })
);

export const postDietPlanNotesAsync = createAsyncThunk(
  'dietPlan/postDietPlanNotesAsync',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/diet-plan/save-notes',
      method: 'post',
      data,
    })
);

export const getDietPlanNotesAsync = createAsyncThunk(
  'dietPlan/getDietPlanNotesAsync',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/diet-plan/get-notes/${id}`,
      method: 'get',
    })
);
