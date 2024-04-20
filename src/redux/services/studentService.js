import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';


export const postStudentCreateAsync = createAsyncThunk('student/postStudentCreateAsync', async (data, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/student/create-student',
    method: 'post',
    data,
  })
);


export const getStudentListAsync = createAsyncThunk('student/getStudentListAsync', async (params, toolkit) =>
  AxiosClient({
    toolkit,
    url: '/student/list-student',
    method: 'get',
    params,
  })
);

export const getStudentByIdAsync = createAsyncThunk('student/getStudentByIdAsync', async ({id}, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/student/get-student/${id}`,
    method: 'get',
  })
);


export const updateStudentAsync = createAsyncThunk('student/updateStudentAsync',async ({ id, data }, toolkit) =>
      AxiosClient({
        toolkit,
        url: `/student/update-student/${id}`,
        method: 'put',
        data,
      })
  );

  export const deleteStudentAsync = createAsyncThunk('student/updateStudentAsync', async (id, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/student/delete-student/${id}`,
    method: 'delete',
  })
);
