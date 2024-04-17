import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosClient from '@utils/axios';

export const getProfileByIdAsync = createAsyncThunk('user/getProfileByIdAsync', async ({id}, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/profile/get-profile-admin/${id}`,
    method: 'get',
  })
);

export const getPrakritiDataByIdAsync = createAsyncThunk('user/getPrakritiDataByIdAsync', async ({id, page}, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/prakriti/get-all-userdata-admin/${id}?page=${page}&limit=1`,
    method: 'get',
  })
);

export const updatePakritiByIdAsync = createAsyncThunk(
  'user/updatePakritiByIdAsync',
  async ({ id, data }, toolkit) =>
    AxiosClient({
      toolkit,
      url: `/prakriti/update-doctorResult/${id}`,
      method: 'put',
      data,
    })
);

export const getAssessmentByIdAsync = createAsyncThunk('user/getAssessmentByIdAsync', async ({id, page}, toolkit) =>
  AxiosClient({
    toolkit,
    url: `/assessment/getall-assessment-admin/${id}?page=${page}&limit=1`,
    method: 'get',
  })
);

