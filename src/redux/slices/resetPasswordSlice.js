import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { postResetPasswordAsync,postNewPasswordAsync,postVerifyCodeAsync } from '../services';

const initialState = {
  isLoading: false,
  
  forgotPassData : [],
  verifyData: [],
  newPassData: [],
};

const resetPasswordSlice = createSlice({
  name: 'loginSlice',
  initialState,
  reducers: {
    emptyResetPassword: () => initialState,
  },
  extraReducers: (builder) => {
  
    // Send OTP ----------
    builder.addMatcher(isAnyOf(postResetPasswordAsync.pending), (state, { payload }) => {
      state.isLoading = true;
    });
    builder.addMatcher(isAnyOf(postResetPasswordAsync.fulfilled), (state, { payload }) => {
      state.isLoading = false;
      state.forgotPassData = payload;
    });
    builder.addMatcher(isAnyOf(postResetPasswordAsync.rejected), (state, { payload }) => {
      state.isLoading = false;
      state.forgotPassData = [];
    });

    // Verify OTP ----------
    builder.addMatcher(isAnyOf(postVerifyCodeAsync.pending), (state, { payload }) => {
        state.isLoading = true;
      });
      builder.addMatcher(isAnyOf(postVerifyCodeAsync.fulfilled), (state, { payload }) => {
        state.isLoading = false;
        state.verifyData = payload;
      });
      builder.addMatcher(isAnyOf(postVerifyCodeAsync.rejected), (state, { payload }) => {
        state.isLoading = false;
        state.verifyData = [];
      });

      // Change Password ----------
    builder.addMatcher(isAnyOf(postNewPasswordAsync.pending), (state, { payload }) => {
        state.isLoading = true;
      });
      builder.addMatcher(isAnyOf(postNewPasswordAsync.fulfilled), (state, { payload }) => {
        state.isLoading = false;
        state.newPassData = payload;
      });
      builder.addMatcher(isAnyOf(postNewPasswordAsync.rejected), (state, { payload }) => {
        state.isLoading = false;
        state.newPassData = [];
      });
  },
});

export const { emptyResetPassword } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
