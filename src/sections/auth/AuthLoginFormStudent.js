import { useState } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSnackbar } from '@components/snackbar';
import { getPermissionByIdAsync, postStudentLoginAsync } from '@redux/services';
import { Link as RouterLink } from 'react-router-dom';
import { PATH_AUTH, PATH_DASHBOARD } from '@routes/paths';
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';

// ----------------------------------------------------------------------

export default function AuthLoginFormStudent() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.login);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    emailOrRoll: Yup.string().required('Email or University Roll Number is required'),
    
    password: Yup.string().required('Password is required'),
  });

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
  });
  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const payloadData = {password: data.password};
    if (data.emailOrRoll.includes('@')) {
      payloadData.email = data.emailOrRoll;
    } else {
      payloadData.rollNumber = data.emailOrRoll;
    }

    const response = await dispatch(postStudentLoginAsync(payloadData));

      if (response?.payload?.success) {
        console.log('response', response?.payload?.data?.accessToken)
        localStorage.setItem('token', response?.payload?.data?.accessToken);
        // const res = await dispatch(getPermissionByIdAsync(response?.payload?.data?.staff?.role?._id));
        // if (res?.payload?.success) {
        localStorage.setItem(
          'userData',
          JSON.stringify({ ...response?.payload?.data?.data })
        );
        // }
        enqueueSnackbar('Logged in successfully');
        navigate(PATH_DASHBOARD.dashboard.root);
      }
    } catch (error) {
      console.error('error');
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message || error,
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="emailOrRoll" label="University Roll Number or Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack alignItems="flex-end" sx={{ my: 2 }}>
        <Link
          to={PATH_AUTH.resetPassword}
          component={RouterLink}
          variant="body2"
          color="inherit"
          underline="always"
        >
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isLoading}
        sx={{
          bgcolor: 'text.primary',
          color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          '&:hover': {
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          },
        }}
      >
        Login
      </LoadingButton>
    </FormProvider>
  );
}
