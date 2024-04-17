import FormProvider, { RHFAutocomplete, RHFRadioGroup } from '@components/hook-form';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { getServiceListAsync } from '@redux/services';
import { createManualOrderAsync, getAllPlanListAsync } from '@redux/services/planService';
import { getTimeslotsScheduleAsync } from '@redux/services/scheduleService';
import { getUsersAsync } from '@redux/services/usersService';
import { PATH_DASHBOARD } from '@routes/paths';
import moment from 'moment/moment';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

const DOCTOR_TYPE = [
  {
    label: 'Ayurvedic Doctor',
    value: 'ayurvedic doctor',
  },
  {
    label: 'Nutritionist',
    value: 'nutritionist',
  },
];

export default function CreateServices() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const [selectDoctorType, setSelectDoctorType] = useState('ayurvedic doctor');
  const [appointmentDate, setAppointmentDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const { users } = useSelector((store) => store?.users);
  const { modulePermit } = useSelector((store) => store?.menupermission);
  const { getTimeslotsScheduleData } = useSelector((store) => store?.schedule);
  const { ServiceData } = useSelector((store) => store?.service);

  const CouponSchema = Yup.object().shape({
    userId: Yup.object().required('User is required.'),
    timeslot: Yup.object().required('Timeslot is required.'),
  });

  const defaultValues = useMemo(
    () => ({
      date: new Date(),
      doctorType: 'ayurvedic doctor',
    }),
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
        mrp: ServiceData[0]?.basePrice,
        disocunt: 0,
        otherService: 0,
        payableAmt: ServiceData[0]?.discountPrice,
      };
      const formData = new FormData();
      formData.append('userId', data.userId._id);
      formData.append('serviceId', ServiceData[0]._id);
      formData.append('type', 'Service');
      formData.append('patientName', data?.userId?.name);
      formData.append('patientNo', data?.userId?.mobile);
      formData.append('timeSlot', JSON.stringify(data?.timeslot));
      formData.append('billSummary', JSON.stringify(billSummary));

      const response = await dispatch(createManualOrderAsync(formData));

      if (response?.payload?.data?.success) {
        enqueueSnackbar('Manual Order successfully!');
        navigate(PATH_DASHBOARD.bookingservice.list);
        reset();
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong!');
    }
  };

  useEffect(() => {
    if (selectDoctorType && appointmentDate) {
      const params = {
        stafftype: selectDoctorType,
        date: appointmentDate,
      };
      const query = {
        page: 1,
        limit: 1,
        type: selectDoctorType === "nutritionist" ? "nutrition" : selectDoctorType,
      };
      dispatch(getServiceListAsync(query));

      dispatch(getTimeslotsScheduleAsync(params));
    }
  }, [dispatch, selectDoctorType, appointmentDate]);

  useEffect(() => {
    dispatch(getUsersAsync());
    dispatch(getAllPlanListAsync());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const onChangeDoctorType = (newValue) => {
    setValue('doctorType', newValue);
    setSelectDoctorType(newValue);
  };

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
                  ? `${option.name?.replace(/\b\w/g, (char) => char.toUpperCase())}  (${option.mobile
                  })`
                  : option.mobile
              }
              isOptionEqualToValue={(option, value) => option._id === value._id}
              onChange={(e, newValue) => {
                setValue('userId', newValue, { shouldValidate: true });
              }}
            />

            <RHFRadioGroup
              row
              spacing={4}
              name="doctorType"
              options={DOCTOR_TYPE}
              onChange={(e, newValue) => onChangeDoctorType(newValue)}
            />

            <Controller
              name="date"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <DatePicker
                    label="New Date"
                    value={field.value}
                    onChange={(newValue) => {
                      field.onChange(newValue);
                      if (newValue) {
                        setAppointmentDate(moment(newValue).format('YYYY-MM-DD'));
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                    format="dd/MM/yyyy"
                    minDate={new Date()}
                  />
                  {error && (
                    <Typography variant="caption" color="error">
                      {error.message}
                    </Typography>
                  )}
                </Box>
              )}
            />
            <RHFAutocomplete
              name="timeslot"
              label="Available Time"
              options={getTimeslotsScheduleData ?? []}
              getOptionLabel={(option) =>
                option && option.startTime
                  ? `${moment.utc(option.startTime).format('HH:mm')} - ${moment
                    .utc(option.endTime)
                    .format('HH:mm')}`
                  : ''
              }
              isOptionEqualToValue={(option, value) =>
                moment.utc(option.startTime).format('HH:mm') +
                moment.utc(option.endTime).format('HH:mm') ===
                moment.utc(value.startTime).format('HH:mm') +
                moment.utc(value.endTime).format('HH:mm')
              }
            />
          </Box>

          <Stack gap="10px" justifyContent="flex-end" flexDirection="row" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Create Service Booking
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </FormProvider>
  );
}
