import FormProvider, { RHFAutocomplete, RHFTextField } from '@components/hook-form';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  TextField,
  CircularProgress,
  IconButton,
  InputAdornment,
  Table,
  TableContainer,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Typography,
  Paper,
  Stack,
} from '@mui/material';
import Label from '@components/label';
import {
  postLeaveCreateAsync,
  updateLeaveAsync,
  getStaffListAsync,
  getStaffDocOrNutrAsync,
} from '@redux/services';
import { PATH_DASHBOARD } from '@routes/paths';
import { generateDateFromTo, addDaysToDate, get30DateFromTodate } from '@utils/generateDateFromTo';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState, Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Iconify from '@components/iconify';
import moment from 'moment/moment';

LeaveRequestForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentLeave: PropTypes.object,
};

export default function LeaveRequestForm({ isEdit = false, isView = false, currentLeave }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const user = JSON.parse(localStorage.getItem('userData'));
  console.log('user', user);
  const { staffDocOrNut, staffData } = useSelector((store) => store?.staff);
  const { isLoading } = useSelector((store) => store?.leave);

  const [daysTotal, setDaysTotal] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [copyToAll, setCopyToAll] = useState(false);

  const LeaveSchema = Yup.object().shape({
    startDate: Yup.string().required('Start Date is required.'),
    endDate: Yup.string()
      .required('End Date is required.')
      .test(
        'is-greater-than-start',
        'End Date must be greater than or equal to Start Date',
        (endDate, context) => {
          const { startDate } = context.parent;

          if (!startDate || !endDate) {
            // If either date is not available, let the required validation handle it
            return true;
          }

          return moment(endDate).isSameOrAfter(startDate, 'day');
        }
      ),
    altPhoneNumber: Yup.string().required('Alternate Phone Number is required.'),
    reason: Yup.string().required('Reason for Leave is required.'),
  });
  const defaultValues = useMemo(
    () => ({
      reason: currentLeave?.reason || '',
      altPhoneNumber: currentLeave?.altPhoneNumber || '',
      studentId: currentLeave?.studentId || null,
      startDate: currentLeave?.startDate ? new Date(currentLeave?.startDate) : null,
      endDate: currentLeave?.endDate ? new Date(currentLeave?.endDate) : null,
    }),
    [currentLeave]
  );

  const methods = useForm({
    resolver: yupResolver(LeaveSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    getValues,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const { trigger } = methods;

  const StandardDateTime = (date) => {
    // Add 5 hours and 30 minutes to the date
    const newDate = new Date(date.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000);
    return newDate;
  };

  const onSubmit = async (data) => {
    const payload = {
      startDate: StandardDateTime(new Date(data.startDate)),
      endDate: StandardDateTime(new Date(data.endDate)),
      altPhoneNumber: data.altPhoneNumber,
      reason: data.reason,
      studentId: user._id,
    };
    try {
      const response = await dispatch(postLeaveCreateAsync(payload));

      if (response?.payload?.success) {
        enqueueSnackbar(isEdit ? 'Leave Update successfully!' : 'Leave Created successfully!');
        navigate(PATH_DASHBOARD.leaveRequest.list);
        reset();
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong!');
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate(PATH_DASHBOARD.leaveRequest.list);
  };

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            height: '70vh',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      ) : (
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
                <Controller
                  name="startDate"
                  disabled={isView}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <DatePicker
                        label="Start Date"
                        disabled={isView}
                        value={field.value}
                        onChange={(newValue) => field.onChange(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                        format="dd/MM/yyyy"
                        // minDate={new Date()}
                      />
                      {error && (
                        <Typography variant="caption" color="error">
                          {error.message}
                        </Typography>
                      )}
                    </Box>
                  )}
                />
                <Controller
                  name="endDate"
                  disabled={isView}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <DatePicker
                        label="End Date"
                        disabled={isView}
                        value={field.value}
                        onChange={(newValue) => field.onChange(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!error}
                            helperText={error?.message}
                          />
                        )}
                        format="dd/MM/yyyy"
                        // minDate={new Date()}
                      />
                      {error && (
                        <Typography variant="caption" color="error">
                          {error.message}
                        </Typography>
                      )}
                    </Box>
                  )}
                />
                <Controller
                  name="altPhoneNumber"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <RHFTextField
                      {...field}
                      label="Alternate Mobile Number"
                      type="number"
                      error={!!error}
                      fullWidth
                      helperText={error?.message}
                      // focused={isEdit}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (inputValue.length <= 10) {
                          field.onChange(inputValue);
                        } else {
                          field.onChange(inputValue.slice(0, 10));
                        }
                      }}
                      disabled={isView}
                    />
                  )}
                />
                <RHFTextField disabled={isView} name="reason" label="Reason For Leave" />
              </Box>

              {isView ? (
                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton onClick={handleBack} type="button" variant="contained" sx={{color: 'white'}}>
                    Back
                  </LoadingButton>
                </Stack>
              ) : (
                <Stack gap="10px" justifyContent="flex-end" flexDirection="row" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    sx={{ color: 'white' }}
                  >
                    {!isEdit ? 'Create Leave' : 'Save Changes'}
                  </LoadingButton>

                  {isEdit && (
                    <LoadingButton
                      onClick={handleBack}
                      type="button"
                      variant="contained"
                      color="error"
                    >
                      Cancel
                    </LoadingButton>
                  )}
                </Stack>
              )}
            </Card>
          </Grid>
        </FormProvider>
      )}
    </>
  );
}

const TableHeading = ({ column }) => (
  <TableHead>
    <TableRow>
      {column.map((ev, index) => (
        <TableCell
          key={index}
          sx={{
            backgroundColor: '#F2F3F7 !important',
            color: '#000000 !important',
            fontWeight: 700,
          }}
        >
          {ev.name}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

TableHeading.propTypes = {
  column: PropTypes.array,
};

const TimeTextField = ({ width, placeholder, sx, disabled, ...other }) => (
  <TextField
    width={width}
    size="small"
    type="time"
    placeholder={placeholder}
    InputProps={{
      sx: { borderRadius: '10px !important' },
      startAdornment: <InputAdornment position="start"> </InputAdornment>,
    }}
    sx={sx}
    disabled={disabled}
    {...other}
  />
);

TimeTextField.propTypes = {
  width: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  sx: PropTypes.object,
  disabled: PropTypes.bool,
};

const getButtonStyles = (ev, evv) => {
  const baseStyles = {
    color: 'white',
    margin: '5px',
    cursor: ev.availability ? 'pointer' : 'default',
  };

  if (ev.availability) {
    if (evv.from !== '' && evv.to !== '') {
      return {
        ...baseStyles,
        backgroundColor: '#1a53ff',
      };
    }

    if (ev.slots.length > 1) {
      return {
        ...baseStyles,
        backgroundColor: '#1a53ff',
      };
    }
  }

  return {
    ...baseStyles,
    backgroundColor: '#F3F3F3',
  };
};
