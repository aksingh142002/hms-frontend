import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';


export const postServiceCreateAsync = createAsyncThunk('service/postServiceCreateAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/service/create-service',
    method: 'post',
    data,
  })
);


export const getServiceListAsync = createAsyncThunk('service/getServiceListAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/service/list-service',
    method: 'get',
    params,
  })
);

export const getServiceByIdAsync = createAsyncThunk('service/getServiceByIdAsync', async ({id}, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/service/get-service/${id}`,
    method: 'get',
  })
);


export const updateBloodServiceAsync = createAsyncThunk('service/updateBloodServiceAsync',async ({ id, data }, toolkit) =>
      AxiosClient({
        toolkit,
        url: `/service/update-bloodtest-service/${id}`,
        method: 'put',
        data,
      })
  );

  export const deleteServiceAsync = createAsyncThunk('service/updateServiceAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/service/delete-service/${id}`,
    method: 'delete',
  })
);
