import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';


export const postResetPasswordAsync = createAsyncThunk('auth/postResetPasswordAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/staff/send-otp',
    method: 'post',
    data,
  })
);
export const postNewPasswordAsync = createAsyncThunk('auth/postNewPasswordAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/staff/change-password',
    method: 'post',
    data,
  })
);
export const postVerifyCodeAsync = createAsyncThunk('auth/postVerifyCodeAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/staff/verify-otp',
    method: 'post',
    data,
  })
);