import FormProvider, { RHFAutocomplete } from '@components/hook-form';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { createManualOrderAsync, getAllPlanListAsync } from '@redux/services/planService';
import { getUsersAsync } from '@redux/services/usersService';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

export default function CouponForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const { users } = useSelector((store) => store?.users);
  const { planData } = useSelector((store) => store?.plan);

  const { modulePermit } = useSelector((store) => store?.menupermission);

  const CouponSchema = Yup.object().shape({
    userId: Yup.object().required('User is required.'),
    planId: Yup.object().required('Plan is required.'),
  });

  const defaultValues = useMemo(
    () => ({}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const methods = useForm({
    resolver: yupResolver(CouponSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    getValues,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const billSummary = {
        mrp: data?.planId?.basePrice,
        disocunt: 0,
        otherService: 0,
        payableAmt: data?.planId?.discountPrice,
      };
      const formData = new FormData();
      formData.append('userId', data.userId._id);
      formData.append('planId', data.planId._id);
      formData.append('type', 'Plan');
      formData.append('patientName', data?.userId?.name);
      formData.append('patientNo', data?.userId?.mobile);
      formData.append('billSummary', JSON.stringify(billSummary));

      const response = await dispatch(createManualOrderAsync(formData));

      if (response?.payload?.data?.success) {
        enqueueSnackbar('Manual Order successfully!');
        navigate(PATH_DASHBOARD.bookingplan.list);
        reset();
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong!');
    }
  };

  useEffect(() => {
    const query = { status: 'unpaid' };
    dispatch(getUsersAsync(query));
    dispatch(getAllPlanListAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Card sx={{ p: 3, width: '100%' }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFAutocomplete
              name="userId"
              label="User"
              options={users}
              getOptionLabel={(option) =>
                option && option.name
                  ? `${option.name?.replace(/\b\w/g, (char) => char.toUpperCase())}  (${
                      option.mobile
                    })`
                  : option.mobile
              }
              isOptionEqualToValue={(option, value) => option._id === value._id}
              onChange={(e, newValue) => {
                setValue('userId', newValue, { shouldValidate: true });
                setValue('planId', null);
              }}
            />

            <RHFAutocomplete
              name="planId"
              label="Plan"
              options={planData}
              getOptionLabel={(option) =>
                option && option.title
                  ? option.title?.replace(/\b\w/g, (char) => char.toUpperCase())
                  : ''
              }
              isOptionEqualToValue={(option, value) => option._id === value._id}
            />
          </Box>

          <Stack gap="10px" justifyContent="flex-end" flexDirection="row" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Create Plan Booking
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </FormProvider>
  );
}
