import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';
import axios from 'axios';
import { HOST_API_KEY } from '../../config-global';

export const postStaffCreateAsync = createAsyncThunk(
  'staff/postStaffCreateAsync',
  async (formData, toolkit) =>
    axios.post(`${HOST_API_KEY}staff/create-staff`, formData, {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `${localStorage?.getItem('token')}`,
      },
    })
);

export const getStaffListAsync = createAsyncThunk(
  'staff/getStaffListAsync',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/staff/list-staff',
      method: 'get',
      params,
    })
);

export const getStaffDocOrNutrAsync = createAsyncThunk(
  'staff/getStaffDocOrNutrAsync',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/staff/list-doc-nut/both',
      method: 'get',
      params,
    })
);


export const getStaffDocAsync = createAsyncThunk(
  'staff/getStaffDocAsync',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/staff/list-doc-nut/doc',
      method: 'get',
      params,
    })
);

export const getStaffNutAsync = createAsyncThunk(
  'staff/getStaffNutAsync',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/staff/list-doc-nut/nut',
      method: 'get',
      params,
    })
);

export const getStaffByIdAsync = createAsyncThunk(
  'staff/getStaffByIdAsync',
  async ({ id }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/staff/get-staff/${id}`,
      method: 'get',
    })
);

export const updateStaffAsync = createAsyncThunk(
  'staff/updateStaffAsync',
  async ({ id, data }, toolkit) =>
    axios.put(`${HOST_API_KEY}staff/update-staff/${id}`, data, {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `${localStorage?.getItem('token')}`,
      },
    })
);

export const deleteStaffAsync = createAsyncThunk('staff/updateStaffAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/staff/delete-staff/${id}`,
    method: 'delete',
  })
);


export const appointmentRescheduleAsync = createAsyncThunk(
  'appointmentReschedule/edit',
  async ({ id, data }, toolkit) =>
    axios.put(`${ HOST_API_KEY }appointment/edit/${ id }`, data, {
      headers: {
        Authorization: `${ localStorage?.getItem('token') }`,
      },
    })
);
