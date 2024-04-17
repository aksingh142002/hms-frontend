import FormProvider, {
  RHFAutocomplete,
  RHFMultiSelect,
  RHFTextField,
  RHFRadioGroup,
} from '@components/hook-form';
import Iconify from '@components/iconify';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Box,
  Card,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import { postCouponCreateAsync, updateCouponAsync } from '@redux/services';
import { PATH_DASHBOARD } from '@routes/paths';
import { options } from 'numeral';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

CouponForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentCoupon: PropTypes.object,
};
const COUPON_TYPE = [
  {
    label: 'amount',
    value: 'amount',
  },
  {
    label: 'percent',
    value: 'percent',
  },
];
export default function CouponForm({ isEdit = false, isView = false, currentCoupon }) {
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const { isLoading } = useSelector((store) => store?.coupon);

  const CouponSchema = Yup.object().shape({
    couponName: Yup.string().required('Coupon Name is required.'),
    couponNo: Yup.string().required('Coupon Code is required.'),
    couponAmount: coupon === 'amount' ? Yup.string().required('Coupon Amount is required.') : '',
    couponPercent: coupon === 'percent' ? Yup.string().required('Coupon Percent is required.') : '',
    maxDiscount: coupon === 'percent' ? Yup.string().required('Max Discount is required.') : '',
    noOfIssued: Yup.string().required('No of issue is required.'),
    minimumOrderPrice: Yup.string().required('Minimum Order Price is required.'),
    expiryDate: Yup.date()
      .typeError('Expiry Date is required.')
      .min(new Date(), 'Expiry Date must be a future date')
      .required('Expiry Date is required.'),
  });

  const addTimeToExpiryDate = (date) => {
    // Add 5 hours and 30 minutes to the date
    const newDate = new Date(date.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000);
    return newDate;
  };

  const defaultValues = useMemo(
    () => ({
      couponName: currentCoupon?.couponName || '',
      couponType: currentCoupon?.couponType || 'amount',
      couponNo: currentCoupon?.couponNo || '',
      couponAmount: coupon === 'amount' ? currentCoupon?.couponAmtOrPer || '' : '',
      couponPercent: coupon === 'percent' ? currentCoupon?.couponAmtOrPer || '' : '',
      noOfIssued: currentCoupon?.noOfIssued || '',
      minimumOrderPrice: currentCoupon?.minimumOrderPrice || '',
      maxDiscount: currentCoupon?.maxDiscount || null,
      expiryDate: currentCoupon?.expiryDate ? new Date(currentCoupon?.expiryDate) : null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCoupon]
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

  const values = watch();
  const couponType = watch('couponType');

  useEffect(() => {
    if (values.couponType === 'percent') {
      // Clear values for the 'percent' type fields
      setValue('couponAmount', '');
    } else if (values.couponType === 'amount') {
      // Clear values for the 'amount' type fields
      setValue('couponPercent', '');
      setValue('maxDiscount', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, coupon]);

  const [selectedValues, setSelectedValues] = useState([]);

  const handleChange = (event, newValue) => {
    setSelectedValues(newValue);
  };

  useEffect(() => {
    setCoupon(couponType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponType]);

  useEffect(() => {
    if ((isEdit && currentCoupon) || (isView && currentCoupon)) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentCoupon]);

  const onSubmit = async (value) => {
    const data = {
      ...value,
      expiryDate: !isEdit ? addTimeToExpiryDate(new Date(value.expiryDate)) : value.expiryDate,
      couponAmtOrPer: value.couponAmount || value.couponPercent,
    };
    // Exclude couponAmount and couponPercent from the payload
    delete data.couponAmount;
    delete data.couponPercent;

    // Exclude couponAmount and couponPercent from the payload
    delete data.couponAmount;
    delete data.couponPercent;
    try {
      const response = await dispatch(
        isEdit ? updateCouponAsync({ id: currentCoupon?._id, data }) : postCouponCreateAsync(data)
      );
      if (response?.payload?.success) {
        enqueueSnackbar(isEdit ? 'Coupon Update successfully!' : 'Coupon Created successfully!');
        navigate(PATH_DASHBOARD.coupon.list);
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
            <RHFTextField disabled={isView} name="couponName" label="Coupon Name" />
            <RHFTextField disabled={isView} name="couponNo" label="Coupon Code" />
            <Stack spacing={1} disabled={isView}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Coupon Type
              </Typography>

              <RHFRadioGroup
                row
                spacing={4}
                disabled={isView}
                name="couponType"
                options={COUPON_TYPE}
              />
            </Stack>
            {couponType === 'amount' && (
              <RHFTextField
                disabled={isView}
                name="couponAmount"
                label="Coupon Amount"
                type="number"
              />
            )}
            {couponType === 'percent' && (
              <>
                <RHFTextField
                  disabled={isView}
                  name="couponPercent"
                  label="Coupon Percent"
                  type="number"
                />
                <RHFTextField
                  disabled={isView}
                  name="maxDiscount"
                  label="Max Discount"
                  type="number"
                />
              </>
            )}
            <RHFTextField
              disabled={isView}
              name="noOfIssued"
              label="Number Of Issue"
              type="number"
            />
            <RHFTextField
              disabled={isView}
              name="minimumOrderPrice"
              label="Minimum Order Price"
              type="number"
            />

            <Controller
              name="expiryDate"
              disabled={isView}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <DatePicker
                    label="Expiry Date"
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
                {!isEdit ? 'Create Coupon' : 'Save Changes'}
              </LoadingButton>

              {isEdit && (
                <LoadingButton onClick={handleBack} type="button" variant="contained" color="error">
                  Cancel
                </LoadingButton>
              )}
            </Stack>
          )}
        </Card>
      </Grid>
    </FormProvider>
  );
}
