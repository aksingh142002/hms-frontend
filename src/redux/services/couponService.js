import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';


export const postCouponCreateAsync = createAsyncThunk('coupon/postCouponCreateAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/coupon/create-coupon',
    method: 'post',
    data,
  })
);


export const getCouponListAsync = createAsyncThunk('coupon/getCouponListAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/coupon/list-coupon',
    method: 'get',
    params,
  })
);

export const getCouponByIdAsync = createAsyncThunk('coupon/getCouponByIdAsync', async ({id}, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/coupon/get-coupon/${id}`,
    method: 'get',
  })
);


export const updateCouponAsync = createAsyncThunk('coupon/updateCouponAsync',async ({ id, data }, toolkit) =>
      AxiosClient({
        toolkit,
        url: `/coupon/update-coupon/${id}`,
        method: 'put',
        data,
      })
  );

  export const deleteCouponAsync = createAsyncThunk('coupon/updateCouponAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/coupon/delete-coupon/${id}`,
    method: 'delete',
  })
);
