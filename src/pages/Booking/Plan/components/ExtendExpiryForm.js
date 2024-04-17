import FormProvider, { RHFSelect, RHFTextField, RHFCheckbox } from '@components/hook-form';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import { Box, Card, Grid, Stack, Typography, TextField } from '@mui/material';
import {
 getBookingListAsync,
  updatePlanExpiryAsync,
} from '@redux/services';
import { PATH_DASHBOARD } from '@routes/paths';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment/moment';
import * as Yup from 'yup';

ExtendExpiryForm.propTypes = {
  id: PropTypes.string,
  currentExpiry: PropTypes.string,
  onSuccess: PropTypes.func,
};

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit), type: 'Plan' };
export default function ExtendExpiryForm({ id, currentExpiry, onSuccess }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { isLoading } = useSelector((store) => store?.role);

  const ExpirySchema = Yup.object().shape({
    expiredplanDate: Yup.date().max(moment.utc(currentExpiry).add(15, 'days').toDate(), 'Expiry Date cannot exceed 15 days from the current expiry').required('Expiry Date is required'),
  });

  const defaultValues = useMemo(
    () => ({
      expiredplanDate: currentExpiry ? new Date(currentExpiry) : null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentExpiry]
  );

  const methods = useForm({
    resolver: yupResolver(ExpirySchema),
    defaultValues,
  });

  const { reset, control,setValue, handleSubmit } = methods;

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(updatePlanExpiryAsync({ id, data }));
      if (response?.payload?.success) {
        enqueueSnackbar('Plan expiry extended successfully', {
          variant: 'success',
        });
        onSuccess();
        reset();
        dispatch(getBookingListAsync(DEFAULT_QUERY))
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3} sx={{ width: 400}}>
        <Grid item xs={12}>
          <Box sx={{ p: 3 }}>
            
              <Controller
                name="expiredplanDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                    <DatePicker
                      label="Expiry Date"
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
        </Grid>
      </Grid>
            <Stack sx={{ mb: '20px',gap: '10px', justifyContent:"flex-end", flexDirection:"row"}} >
              <LoadingButton type="submit" loading={isLoading} variant="contained">
                Submit
              </LoadingButton>
              <LoadingButton
                      onClick={onSuccess}
                      type="button"
                      variant="contained"
                      color="error"
                    >
                      Cancel
                    </LoadingButton>
            </Stack>
    </FormProvider>
  );
}
