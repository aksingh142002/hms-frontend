import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';

import { useSnackbar } from 'notistack';
import { postResetPasswordAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import FormProvider, { RHFTextField } from '../../components/hook-form';
// ----------------------------------------------------------------------

export default function AuthResetPasswordForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { isLoading } = useSelector((store) => store?.resetPass);

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: '' },
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(postResetPasswordAsync(data));

      if (response?.payload?.success) {
        navigate(PATH_AUTH.verify);
        localStorage.setItem('email', JSON.stringify(data.email));
        localStorage.setItem('email-recovery', JSON.stringify(response?.payload?.data));
        enqueueSnackbar(`Your OTP is :   ${response?.payload?.data?.otp} `);
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
      <RHFTextField name="email" label="Email address" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isLoading}
        sx={{ mt: 3 }}
      >
        Send Request
      </LoadingButton>
    </FormProvider>
  );
}
