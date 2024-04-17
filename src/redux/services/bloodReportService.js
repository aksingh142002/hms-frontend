import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';
import axios from 'axios';
import { HOST_API_KEY } from '../../config-global';

export const getbloodReportAsync = createAsyncThunk(
  'bloodReport/getbloodReportAsync',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/blood-report/getall-bloodtest-report',
      method: 'get',
      params,
    })
);

export const getbloodReportByIdAsync = createAsyncThunk(
  'bloodReport/getbloodReportAsync',
  async ({ id }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/blood-report/get-bloodtest-report/${id}`,
      method: 'get',
    })
);

export const addBloodReportAsync = createAsyncThunk(
  'bloodReport/addBloodReportAsync',
  async (data, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/blood-report/create-bloodtest-report',
      method: 'post',
      data,
    })
);

export const updateBloodReportAsync = createAsyncThunk(
  'bloodReport/updateBloodReportAsync',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/blood-report/update-bloodtest-report/${id}`,
      method: 'put',
      data,
    })
);

export const deletebloodReportAsync = createAsyncThunk(
  'bloodReport/deletebloodReportAsync',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/blood-report/delete-bloodtest-report/${id}`,
      method: 'delete',
    })
);
