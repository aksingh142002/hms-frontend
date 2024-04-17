import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getRouteListAsync = createAsyncThunk(
  'routes/getRouteListAsync',
  async (params, toolkit) =>
    AxiosClient({
      toolkit,
      url: '/routes/getAllRoutes',
      method: 'get',
      params,
    })
);

export const postRouteAsync = createAsyncThunk('routes/postRouteAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/routes/createRoute',
    method: 'post',
    data,
  })
);

// export const deleterouteAsync = createAsyncThunk('routes/deleterouteAsync', async (id, toolkit) =>
//   AxiosClient({
//     toolkit,
//     url: `/routes/delete-route/${id}`,
//     method: 'delete',
//   })
// );
