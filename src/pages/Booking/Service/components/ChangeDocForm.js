import FormProvider, {
  RHFAutocomplete,
  RHFSelect,
  RHFTextField,
  RHFCheckbox,
} from '@components/hook-form';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import { Box, Card, Grid, Stack, Typography, TextField } from '@mui/material';
import {
  getBookingListAsync,
  updateOrderScheduleAsync,
  getStaffDocOrNutrAsync,
  getTimeSlotByStaffAsync,
} from '@redux/services';
import { PATH_DASHBOARD } from '@routes/paths';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment/moment';
import * as Yup from 'yup';

ChangeDocForm.propTypes = {
  id: PropTypes.string,
  currentDoc: PropTypes.string,
  onSuccess: PropTypes.func,
};

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit), type: 'Service' };
export default function ChangeDocForm({ id, currentDoc, onSuccess }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { staffDocOrNut } = useSelector((store) => store?.staff);
  const { timeSlot } = useSelector((store) => store?.schedule);

  const [query, setQuery] = useState('');

  const ChangeDocSchema = Yup.object().shape({
    staffId: Yup.object().required('Staff is required.'),
    date: '',
    timeslot: Yup.object().required('Time Slot is required.'),
  });

  const defaultValues = useMemo(
    () => ({
      staffId: currentDoc.assignedStaff ? currentDoc.assignedStaff : null,
      date: null,
      timeslot: null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDoc]
  );

  const methods = useForm({
    resolver: yupResolver(ChangeDocSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDoc]);
  
  const onSubmit = async (data) => {
    const payload = {
      staffId: data.staffId?._id,
      timeslot: data.timeslot,
    };

    try {
      const response = await dispatch(updateOrderScheduleAsync({ id, data: payload }));
      if (response?.payload?.success) {
        enqueueSnackbar('Booking Re-Scheduled successfully', {
          variant: 'success',
        });
        onSuccess();
        reset();
        dispatch(getBookingListAsync(DEFAULT_QUERY));
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }
  };

  useEffect(() => {
    dispatch(getStaffDocOrNutrAsync());
  }, [dispatch]);
  useEffect(() => {
    if (query) {
      dispatch(getTimeSlotByStaffAsync(query));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, query]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3} sx={{ width: 400, height: 'auto' }}>
        <Grid item xs={12}>
          <Box
            sx={{ p: 5 }}
            rowGap={3}
            columnGap={2}
            display="grid"
            direction="column"
            gridTemplateColumns={{
              xs: 'repeat(1fr)',
              sm: 'repeat(1fr)',
            }}
          >
            <RHFAutocomplete
              name="staffId"
              label="Staff"
              options={staffDocOrNut}
              getOptionLabel={(option) =>
                option && option.name
                  ? option.name.replace(/\b\w/g, (char) => char.toUpperCase())
                  : ''
              }
              isOptionEqualToValue={(option, value) => option?._id === value?._id}
              onChange={(e, newValue) => {
                setValue('staffId', newValue, { shouldValidate: true });
                setValue('date', null);
              }}
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
                      if (newValue && values.staffId) {
                        setQuery({ staffId: values.staffId?._id, date: moment(newValue).format('YYYY-MM-DD') });
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
              options={timeSlot}
              getOptionLabel={(option) =>
                option && option.startTime
                  ? `${moment.utc(option.startTime).format('HH:mm')} - ${moment.utc(option.endTime).format('HH:mm')}`
                  : ''
              }
              isOptionEqualToValue={(option, value) => option?._id === value?._id}
            />
          </Box>
        </Grid>
      </Grid>
      <Stack sx={{ mb: '20px', gap: '10px', justifyContent: 'flex-end', flexDirection: 'row' }}>
        <LoadingButton type="submit" loading={isSubmitting} variant="contained">
          Submit
        </LoadingButton>
        <LoadingButton onClick={onSuccess} type="button" variant="contained" color="error">
          Cancel
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
