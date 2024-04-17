import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { postVerifyCodeAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField, RHFCodes } from '../../components/hook-form';

// ----------------------------------------------------------------------

export default function AuthVerifyCodeForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { isLoading } = useSelector((store) => store?.resetPass);
  // const emailRecovery =
  //   typeof window !== 'undefined' ? localStorage.getItem('email-recovery') : '';

  const emailRecovery = JSON.parse(localStorage.getItem('email-recovery'));

  const VerifyCodeSchema = Yup.object().shape({
    otp: Yup.number()
      .required('One time password is required')
      .min(6, 'Otp must be at least 6 characters'),
  });

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues: { otp: null },
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    const payload = {
      staffId: emailRecovery?.staffId,
      otp: data?.otp,
    };

    try {
      const response = await dispatch(postVerifyCodeAsync(payload));
      if (response?.payload?.success) {
        navigate(PATH_AUTH.newPassword);
        enqueueSnackbar(response?.payload?.message);
      }
    } catch (error) {
      console.error(error);
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
        <RHFTextField
          name="otp"
          label="OTP"
          inputProps={{
            maxLength: 6,
            pattern: '[0-9]{6}',
          }}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isLoading}
          sx={{ mt: 3 }}
        >
          Verify
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
