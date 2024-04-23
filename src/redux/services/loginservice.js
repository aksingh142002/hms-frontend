import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';


export const postLoginAsync = createAsyncThunk('course/postLoginAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/staff/login',
    method: 'post',
    data,
  })
);

export const postLogoutAsync = createAsyncThunk('auth/postLogoutAsync', async(data, toolkit)=>
  AxiosClient({
    toolkit,
    url: '/staff/logout',
    method: 'post',
    // data
  })
)

export const postStudentLoginAsync = createAsyncThunk('course/postStudentLoginAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/student/login-student',
    method: 'post',
    data,
  })
);