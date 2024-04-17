import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';
import axios from 'axios';
import { HOST_API_KEY } from '../../config-global';

export const postPlanCreateAsync = createAsyncThunk(
  'plan/postPlanCreateAsync',
  async (formData, toolkit) =>
    axios.post(`${HOST_API_KEY}plan/create-plan`, formData, {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `${localStorage?.getItem('token')}`,
      },
    })
);

export const getAllPlanListAsync = createAsyncThunk(
  'plan/getAllPlanListAsync',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/plan/getallplans',
      method: 'get',
      params,
    })
);

export const getPlanByIdAsync = createAsyncThunk('plan/getPlanByIdAsync', async ({ id }, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/plan/getplan-byid/${id}`,
    method: 'get',
  })
);

export const getPlanByUserIdAsync = createAsyncThunk(
  'plan/getPlanByUserIdAsync',
  async ({ id }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/plan/get-users-plan-admin/${id}`,
      method: 'get',
    })
);

export const updatePlanAsync = createAsyncThunk(
  'plan/updatePlanAsync',
  async ({ id, data }, toolkit) =>
    axios.put(`${HOST_API_KEY}plan/updateplan-byid/${id}`, data, {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `${localStorage?.getItem('token')}`,
      },
    })
);

export const deletePlanAsync = createAsyncThunk('plan/updatePlanAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/plan/deleteplan-byid/${id}`,
    method: 'delete',
  })
);

export const postDailyRoutineAsync = createAsyncThunk(
  'plan/postDailyRoutineAsync',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/plan/create-dailyroutine-admin',
      method: 'post',
      data,
    })
);

export const getRoutineByUserIdAsync = createAsyncThunk(
  'plan/getRoutineByUserIdAsync',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/plan/get-dailyroutine-admin',
      method: 'get',
      params,
    })
);

export const postDailyReportAsync = createAsyncThunk(
  'plan/getDailyReportAsync',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/dailyreport/get-dailyreport',
      method: 'post',
      data,
    })
);

export const getDietUserReportAsync = createAsyncThunk(
  'dietPlan/getDietUserReport',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/user-report/userServices/${ id }`,
      method: 'get',
    })
);
