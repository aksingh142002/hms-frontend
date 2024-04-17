import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';
import axios from 'axios';
import { HOST_API_KEY } from '../../config-global'



export const postBannerAsync = createAsyncThunk('banner/postBannerAsync', async (formData, toolkit) =>
    axios.post(`${HOST_API_KEY}banner/create-banner`, formData, {
  headers: {
    'content-type': 'multipart/form-data',
    Authorization: `${localStorage?.getItem('token')}`,
  },
})
);

export const getAllBannerAsync = createAsyncThunk('banner/getAllBannerAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/banner/getall-banner',
    method: 'get',
    params,
  })
);

export const updateBannerAsync = createAsyncThunk(
  'banner/updateBannerAsync',
  async ({ id, data }, toolkit) =>
  axios.put(`${HOST_API_KEY}banner/update-banner/${id}`, data, {
    headers: {
      'content-type': 'multipart/form-data',
      Authorization: `${localStorage?.getItem('token')}`,
    },
  })
);

export const updateBannerStatusAsync = createAsyncThunk('banner/updateBannerStatusAsync', async ({ id, data }, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/banner/change-status-banner/${id}`,
    method: 'put',
    data,
  })
);

  export const deleteBannerAsync = createAsyncThunk('banner/deleteBannerAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/banner/delete-banner/${id}`,
    method: 'delete',
  })
);
