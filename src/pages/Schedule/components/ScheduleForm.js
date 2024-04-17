import FormProvider, { RHFAutocomplete } from '@components/hook-form';
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
  postScheduleCreateAsync,
  updateScheduleAsync,
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

ScheduleForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentSchedule: PropTypes.object,
};

export default function ScheduleForm({ isEdit = false, isView = false, currentSchedule }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { staffDocOrNut, staffData } = useSelector((store) => store?.staff);
  const { isLoading } = useSelector((store) => store?.schedule);

  const [daysTotal, setDaysTotal] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [copyToAll, setCopyToAll] = useState(false);

  const ScheduleSchema = Yup.object().shape({
    staff: Yup.object().required('Staff is required.'),
    startDate: Yup.string().required('Start Date is required.'),
    endDate: Yup.string()
      .required('End Date is required.')
      .test(
        'is-greater-than-start',
        'End Date must be greater than or equal to Start Date',
        (endDate, context) => {
          const startDate = context.parent.startDate;

          if (!startDate || !endDate) {
            // If either date is not available, let the required validation handle it
            return true;
          }

          return moment(endDate).isSameOrAfter(startDate, 'day');
        }
      ),
  });
  const defaultValues = useMemo(
    () => ({
      staff: currentSchedule?.staffId || null,
      startDate: currentSchedule?.startDate ? new Date(currentSchedule?.startDate) : null,
      endDate: currentSchedule?.endDate ? new Date(currentSchedule?.endDate) : null,
    }),
    [currentSchedule]
  );

  const methods = useForm({
    resolver: yupResolver(ScheduleSchema),
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

  const generateDate = (from, to) => {
    const startDate = StandardDateTime(new Date(from));
    const endDate = StandardDateTime(new Date(to));

    const dates = generateDateFromTo({
      start: startDate,
      end: endDate,
    });
    const MapDates = dates.map((ev) => ({
      date: ev,
      availability: false,
      slots: [{ from: '', to: '' }],
    }));
    setDaysTotal(MapDates);
    trigger();
  };

  const handleCheckBox = (e, index) => {
    let updatedRow;

    if (!e) {
      updatedRow = {
        availability: e,
        slots: [{ from: '', to: '' }],
      };
    } else {
      updatedRow = { availability: e };
    }

    const stateInfo = [...daysTotal];
    stateInfo.splice(index, 1, { ...stateInfo[index], ...updatedRow });
    setDaysTotal(stateInfo);

    // Check if all individual checkboxes are checked
    const allChecked = stateInfo.every((day) => day.availability);
    setSelectAll(allChecked);
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const updatedDaysTotal = daysTotal.map((day) => ({
      ...day,
      availability: !selectAll,
    }));
    setDaysTotal(updatedDaysTotal);
  };

  const handleCopyToAll = () => {
    if (copyToAll) {
      // Assuming that slots are stored in the first date
      const sourceSlots = daysTotal.length > 0 ? daysTotal[0].slots : [];

      const updatedDaysTotal = daysTotal.map((day) => ({
        ...day,
        slots: [...sourceSlots],
      }));
      setDaysTotal(updatedDaysTotal);
    }
  };

  const handleInputSlot = (index, evvindex) => {
    const findIndex = daysTotal.at(index);
    const updatedRow = {
      ...findIndex,
      slots: [...findIndex.slots, { from: '', to: '' }],
    };
    const stateInfo = [...daysTotal];
    stateInfo.splice(index, 1, { ...stateInfo[index], ...updatedRow });
    setDaysTotal(stateInfo);
  };

  const handleRemoveSlot = (index, evvindex) => {
    const findIndex = daysTotal.at(index);
    const IndexSlot = findIndex.slots;
    IndexSlot.splice(evvindex, 1);
    const updatedRow = {
      ...findIndex,
      slots: IndexSlot,
    };
    const stateInfo = [...daysTotal];
    stateInfo.splice(index, 1, { ...stateInfo[index], ...updatedRow });
    setDaysTotal(stateInfo);
  };

  const handleInputTime = (event, index, evvindex) => {
    const { name, value } = event.target;
    daysTotal[index].slots[evvindex][name] = value;
    const stateInfo = [...daysTotal];
    setDaysTotal(stateInfo);
  };

  useEffect(() => {
    if (isEdit && currentSchedule || isView && currentSchedule) {
      reset(defaultValues)
      // If it's an edit or view case, populate daysTotal with schedule data
      const initialDaysTotal =
        currentSchedule?.schedules?.map((schedule) => ({
          date: new Date(schedule.date),
          availability: schedule.availability,
          slots: schedule.slots.map((slot) => ({
            from: slot.startTime ? moment.utc(slot.startTime).format('HH:mm') : '',
            to: slot.endTime ? moment.utc(slot.endTime).format('HH:mm') : '',
          })),
        })) || [];
      setDaysTotal(initialDaysTotal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentSchedule]);

  const onSubmit = async (data) => {
    const filteredDays = daysTotal.filter((day) => day.availability);
    const payload = {
      startDate: StandardDateTime(new Date(data.startDate)),
      endDate: StandardDateTime(new Date(data.endDate)),
      staffId: data.staff._id,
      schedules: filteredDays.map((day) => ({
        date: new Date(day.date),
        availability: day.availability,
        slots: day.slots.map((slot) => ({
          startTime: slot.from, // Combine date and time, then format
          endTime: slot.to, // Combine date and time, then format
        })),
      })),
    };
    try {
      const response = await dispatch(postScheduleCreateAsync(payload));

      if (response?.payload?.success) {
        enqueueSnackbar(
          isEdit ? 'Schedule Update successfully!' : 'Schedule Created successfully!'
        );
        navigate(PATH_DASHBOARD.schedule.list);
        reset();
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong!');
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate(PATH_DASHBOARD.schedule.list);
  };

  useEffect(() => {
    handleCopyToAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copyToAll]);

  useEffect(() => {
    // dispatch(getStaffDocOrNutrAsync());
    dispatch(getStaffListAsync());
  }, [dispatch]);

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
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                }}
              >
                <RHFAutocomplete
                  disabled={isView}
                  name="staff"
                  label="Staff"
                  options={staffData?.filter(
                    (item) => item?.role.roleName?.trim()?.toLowerCase() !== 'super admin'
                  )}
                  getOptionLabel={(option) =>
                    option && option?.name
                      ? `${option?.name.replace(/\b\w/g, (char) => char.toUpperCase())} (${option?.role?.roleName.replace(/\b\w/g, (char) => char.toUpperCase())})`
                      : ''
                  }
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                />
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
              </Box>

              <Box sx={{ textAlign: 'end', mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => {
                    generateDate(getValues('startDate'), getValues('endDate'));
                    setSelectAll(false); // Reset selectAll when generating new dates
                  }}
                  disabled={
                    isView ||
                    Boolean(
                      getValues('startDate') === '' ||
                        getValues('endDate') === '' ||
                        getValues('staff') === null
                    )
                  }
                  startIcon={<Iconify icon="eva:plus-fill" />}
                >
                  Add
                </Button>
              </Box>
              <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
                <Box sx={{ display: 'flex' }}>
                  <Typography
                    variant="h4"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '15px !important',
                      lineHeight: '30px !important',
                      fontWeight: '500 !important',
                    }}
                  >
                    <Checkbox
                      checked={selectAll}
                      onChange={(e) => {
                        setSelectAll(e.target.checked);
                        handleSelectAll();
                        if (!e.target.checked) {
                          setCopyToAll(false);
                        }
                      }}
                      disabled={isView || daysTotal.length === 0}
                      color="primary"
                    />
                    Select All
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '15px !important',
                      lineHeight: '30px !important',
                      fontWeight: '500 !important', // Required Later
                    }}
                  >
                    <Checkbox
                      checked={copyToAll}
                      onChange={(e) => {
                        setCopyToAll(e.target.checked);
                        handleCopyToAll();
                      }}
                      disabled={isView || !selectAll}
                      color="primary"
                    />
                    Copy To All
                  </Typography>
                </Box>
                <Table aria-label="customized table" sx={{ marginTop: '21px' }}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Available</TableCell>
                      <TableCell align="left">Date</TableCell>
                      <TableCell align="left">Day</TableCell>
                      <TableCell align="left">Availablity</TableCell>
                      <TableCell align="left">Slot</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {daysTotal.map((ev, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ py: '0px !important' }}>
                          <Checkbox
                            checked={ev.availability}
                            onChange={(e) => {
                              const availability = e.target.checked;
                              handleCheckBox(availability, index);
                            }}
                            disabled={isView}
                          />
                        </TableCell>
                        <TableCell sx={{ py: '0px !important' }}>
                          {moment(ev.date).format('DD MMMM YYYY')}
                        </TableCell>
                        <TableCell sx={{ py: '0px !important' }}>
                          {moment(ev.date).format('dddd')}
                        </TableCell>
                        <TableCell sx={{ py: '0px !important' }}>
                          {ev.availability ? 'Available' : 'Unavailable'}
                        </TableCell>
                        <TableCell sx={{ py: '0px !important' }}>
                          {ev.slots.map((evv, evvindex) => (
                            <Box display="flex">
                              <TimeTextField
                                width={220}
                                placeholder="From Time"
                                disabled={isView || !ev.availability}
                                name="from"
                                value={evv.from}
                                onChange={(e) => handleInputTime(e, index, evvindex)}
                                sx={{
                                  margin: '10px',
                                }}
                              />
                              <TimeTextField
                                width={220}
                                placeholder="To Time"
                                disabled={isView || !ev.availability}
                                name="to"
                                value={evv.to}
                                onChange={(e) => handleInputTime(e, index, evvindex)}
                                sx={{
                                  margin: '10px',
                                }}
                              />
                              <Box
                                sx={{
                                  pl: '10px',
                                }}
                                display="flex"
                                alignItems="center"
                              >
                                <TableCell align="left">
                                  <IconButton
                                    disabled={isView}
                                    sx={getButtonStyles(ev, evv)}
                                    onClick={() => {
                                      if (ev.availability && evv.from !== '' && evv.to !== '') {
                                        handleInputSlot(index, evvindex);
                                      }
                                    }}
                                  >
                                    <Iconify icon="carbon:add-filled" />
                                  </IconButton>
                                  <IconButton
                                    disabled={isView}
                                    sx={getButtonStyles(ev, evv)}
                                    onClick={() => {
                                      if (ev.availability && ev.slots.length !== 1) {
                                        handleRemoveSlot(index, evvindex);
                                      }
                                    }}
                                  >
                                    <Iconify icon="clarity:remove-solid" />
                                  </IconButton>
                                </TableCell>
                              </Box>
                            </Box>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {isView ? (
                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton onClick={handleBack} type="button" variant="contained">
                    Back
                  </LoadingButton>
                </Stack>
              ) : (
                <Stack gap="10px" justifyContent="flex-end" flexDirection="row" sx={{ mt: 3 }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Create Schedule' : 'Save Changes'}
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
