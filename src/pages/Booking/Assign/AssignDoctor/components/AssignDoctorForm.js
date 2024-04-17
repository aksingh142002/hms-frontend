import FormProvider, { RHFTextField, RHFAutocomplete } from '@components/hook-form';
// import Iconify from '@components/iconify';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { getStaffDocAsync, putAssignStaffAsync } from '@redux/services';
import { PATH_DASHBOARD } from '@routes/paths';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

AssignDoctorForm.propTypes = {
  isView: PropTypes.bool,
  currentAssign: PropTypes.object,
};

export default function AssignDoctorForm({ isView = false, currentAssign }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const { staffDoc } = useSelector((store) => store?.staff);

  const UserSchema = Yup.object().shape({
    staff: Yup.object().required('Assign Doctor is required.'),
  });

  const defaultValues = useMemo(
    () => ({
      staff: currentAssign?.staff || null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentAssign]
  );

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const {
    reset,
    // watch,
    // control,
    // setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isView && currentAssign) {
      reset(defaultValues);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isView, currentAssign]);

  const onSubmit = async (data) => {
    const payload = {
      assignDoctor: data?.staff?._id,
      orderId: currentAssign?._id,
    };
    try {
      const response = await dispatch(putAssignStaffAsync(payload));
      // If response is a success -
      if (response?.payload?.success) {
        enqueueSnackbar('Assigned Successfully!');
        navigate(PATH_DASHBOARD.bookingplan.list);
        reset();
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong!');
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch(getStaffDocAsync());
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
              disabled={isView}
              name="staff"
              label="Assign Doctor"
              options={staffDoc}
              getOptionLabel={(option) =>
                option && option.name
                  ? option.name.replace(/\b\w/g, (char) => char.toUpperCase())
                  : ''
              }
              isOptionEqualToValue={(option, value) => option._id === value._id}
            />
          </Box>

          {isView ? (
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton onClick={handleBack} type="button" variant="contained">
                Back
              </LoadingButton>
            </Stack>
          ) : (
            <Stack gap="10px" justifyContent="flex-end" flexDirection="row" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Assign
              </LoadingButton>
            </Stack>
          )}
        </Card>
      </Grid>
    </FormProvider>
  );
}
