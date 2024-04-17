import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';
import axios from 'axios';
import { HOST_API_KEY } from '../../config-global';

export const postResourcesCreateAsync = createAsyncThunk(
  'resources/postResourcesCreateAsync',
  async (formData, toolkit) =>
    axios.post(`${HOST_API_KEY}resources/save-content/`, formData, {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `${localStorage?.getItem('token')}`,
      },
    })
);

export const getResourcesListAsync = createAsyncThunk(
  'resources/getResourcesListAsync',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/resources/getallcontent',
      method: 'get',
      params,
    })
);

export const getResourcesByIdAsync = createAsyncThunk(
  'resources/getResourcesByIdAsync',
  async ({ id }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/resources/getcontent-byid/${id}`,
      method: 'get',
    })
);

export const updateResourcesAsync = createAsyncThunk(
  'resources/updateResourcesAsync',
  async ({ id, data }, toolkit) =>
    axios.put(`${HOST_API_KEY}resources/updatecontent-byid/${id}`, data, {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `${localStorage?.getItem('token')}`,
      },
    })
);
export const deleteResourcesAsync = createAsyncThunk(
  'resources/updateResourcesAsync',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/resources/deletecontent-byid/${id}`,
      method: 'delete',
    })
);