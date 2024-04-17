import FormProvider, { RHFAutocomplete, RHFTextField, RHFUpload } from '@components/hook-form';
import Iconify from '@components/iconify';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, InputAdornment, Stack, Typography } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import moment from 'moment';
import {
  adduserReportAsync,
  updateuserReportAsync,
  getUsersAsync,
  getDietUserReportAsync,
} from '@redux/services';
import {  getUserReportListAsync } from '@redux/services/userReportService';

UserReportForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentUserReport: PropTypes.object,
};

export default function UserReportForm({ isEdit = false, isView = false, currentUserReport }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [user, setUser] = useState('');
  const { getDietUserReport } = useSelector((store) => store?.plan);
  const { users } = useSelector((store) => store?.users);
  // const { getUserReportList } = useSelector((store) => store?.userReport);

  const UserSchema = Yup.object().shape({
    userId: Yup.object().required('User is required.'),
    planId: Yup.object().required('Plan/Service is required.'),
    pdfReport: Yup.mixed().test('fileOrURL', 'Select a PDF (Max 100MB)', (value) => {
      if (isEdit) {
        // If in edit mode, check if the value is a valid URL (HTTPS link) or a valid PDF
        return (
          Yup.string()
            .url()
            .matches(/^https:/)
            .isValidSync(value[0]) ||
          (value && value[0] instanceof File && value[0].type === 'application/pdf')
        );
      }
      // If not in edit mode, check if a file is uploaded and if it's a PDF
      return value && value[0] instanceof File && value[0].type === 'application/pdf';
    }),
  });

  const defaultValues = useMemo(
    () => ({
      userId: currentUserReport?.userId || null,
      planId: currentUserReport?.planId || null,
      pdfReport: currentUserReport?.pdfReport || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUserReport]
  );

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (values.userId !== undefined) {
      setUser(values?.userId?._id);
      // if (user !== values?.userId?._id) {
      // setValue('planId', null);
      // }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, currentUserReport]);

  useEffect(() => {
    if ((isEdit && currentUserReport) || (isView && currentUserReport)) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentUserReport]);

  useEffect(() =>
  {
    dispatch(getUserReportListAsync(currentUserReport?._id))
  }, [dispatch, currentUserReport?._id])


  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('userId', data.userId._id);
    formData.append('referenceName', data.planId.name);
    formData.append('referenceType', data.planId.type);
    if (data.planId.type === 'Plan') {
      formData.append('planId', data.planId.planId);
    } else {
      formData.append('serviceId', data.planId.serviceId);
    }
    data?.pdfReport.forEach((file, index) => {
      formData.append('pdf', file);
    });

    try {
      const response = await dispatch(
        isEdit
          ? updateuserReportAsync({ id: currentUserReport?._id, data: formData })
          : adduserReportAsync(formData)
      );

      if (response?.payload?.data?.success) {
        enqueueSnackbar(isEdit ? 'Updated Successfully!' : 'Created Successfully!');
        navigate(PATH_DASHBOARD.userreport.list);
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

  const handleDropFile = useCallback(
    (acceptedFiles) => {
      const files = values.pdfReport || [];

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64File = reader.result;
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            base64: base64File, // Add the Base64 representation to the file object
          });

          // Append the new file to the existing files array
          setValue('pdfReport', [...files, file], { shouldValidate: true });
        };

        reader.readAsDataURL(file);
      });
    },
    [setValue, values.pdfReport]
  );

  const handleRemoveFile = (inputFile) => {
    const filtered = values.pdfReport && values.pdfReport?.filter((file) => file !== inputFile);
    setValue('pdfReport', filtered);
  };

  useEffect(() => {
    const query = { status: 'Paid' };
    dispatch(getUsersAsync(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  useEffect(() => {
    if (user) {
      dispatch(getDietUserReportAsync(user));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user]);

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
              name="userId"
              label="User"
              options={users}
              getOptionLabel={(option) =>
                option && option.name
                  ? `${option.name.replace(/\b\w/g, (char) => char.toUpperCase())}  (${
                      option.patientId
                    })`
                  : ''
              }
              isOptionEqualToValue={(option, value) => option._id === value._id}
              onChange={(e, newValue) => {
                setValue('userId', newValue, { shouldValidate: true });
                setValue('planId', null);
              }}
            />
            <RHFAutocomplete
              disabled={isView}
              name="planId"
              label="Plan/Services"
              options={getDietUserReport?.data || []}
              getOptionLabel={(option) =>
                option && option?.referenceName && option.type !== 'Plan'
                  ? `${ option?.referenceName?.replace(/\b\w/g, (char) => char) }  -(${ option?.referenceType} ${moment
                      .utc(option?.date)
                      .format('DD-MM-YYYY')})`
                  : `${ option?.referenceName?.replace(/\b\w/g, (char) => char) }-(${ option?.referenceType})`
              }
              isOptionEqualToValue={(option, value) => option._id === value._id}
            />
            <Stack spacing={2}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                User Report
              </Typography>
              <RHFUpload
                disabled={isView}
                thumbnail
                multiple
                name="pdfReport"
                label="Upload Report"
                maxSize={100 * 1024 * 1024}
                onDrop={handleDropFile}
                accept={{ 'application/pdf': [] }}
                onRemove={handleRemoveFile}
                // onRemoveAll={() => setValue('report', [], { shouldValidate: true })}
              />
            </Stack>
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
                {!isEdit ? 'Create User Report' : 'Save Changes'}
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
