  import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';
import axios from 'axios';
import { HOST_API_KEY } from '../../config-global';

export const getTestimonialListAsync = createAsyncThunk(
  'testimonial/getTestimonialListAsync',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/testomonials/get-all-test/',
      method: 'get',
      params,
    })
);

export const getTestimonialByIdAsync = createAsyncThunk(
  'testimonial/getTestimonialByIdAsync',
  async ({id}, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/testomonials/get-test-byId/${id}`,
      method: 'get',
    })
);

export const postTestimonialAsync = createAsyncThunk('testimonial/postTestimonialAsync', async (formData, toolkit) =>
    axios.post(`${HOST_API_KEY}testomonials/save-test/`, formData, {
  headers: {
    'content-type': 'multipart/form-data',
    Authorization: `${localStorage?.getItem('token')}`,
  },
})
);

export const updateTestimonialAsync = createAsyncThunk(
  'testimonial/updateTestimonialAsync',
  async ({ id, data }, toolkit) =>
  axios.put(`${HOST_API_KEY}testomonials/update-test/${id}`, data, {
    headers: {
      'content-type': 'multipart/form-data',
      Authorization: `${localStorage?.getItem('token')}`,
    },
  })
);

export const deleteTestimonialAsync = createAsyncThunk('testimonial/deleteTestimonialAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/testomonials/delete-test/${id}`,
    method: 'delete',
  })
);
