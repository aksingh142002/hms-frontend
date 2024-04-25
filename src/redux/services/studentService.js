import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';
import axios from 'axios';
import { HOST_API_KEY } from '../../config-global';

export const postStudentCreateAsync = createAsyncThunk(
  'student/postStudentCreateAsync',
  async (formData, toolkit) =>
    axios.post(`${HOST_API_KEY}student/create-student`, formData, {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `${localStorage?.getItem('token')}`,
      },
    })
);

export const getStudentListAsync = createAsyncThunk(
  'student/getStudentListAsync',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/student/list-student',
      method: 'get',
      params,
    })
);

export const getStudentByIdAsync = createAsyncThunk(
  'student/getStudentByIdAsync',
  async ({ id }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/student/get-student/${id}`,
      method: 'get',
    })
);

export const updateStudentAsync = createAsyncThunk(
  'student/updateStudentAsync',
  async ({ id, data }, toolkit) =>
    axios.put(`${HOST_API_KEY}student/update-student/${id}`, data, {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `${localStorage?.getItem('token')}`,
      },
    })
);

export const deleteStudentAsync = createAsyncThunk(
  'student/updateStudentAsync',
  async (id, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/student/delete-student/${id}`,
      method: 'delete',
    })
);
