/* eslint-disable react-hooks/exhaustive-deps */
import FormProvider, { RHFAutocomplete, RHFUpload } from '@components/hook-form';
import { useSnackbar } from '@components/snackbar';
import UploadBox from '@components/upload/CustomUpload/UploadBox';
import styled from '@emotion/styled';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import {
  postDietPlanCreateAsync,
  updateDietPlanAsync,
  getUsersAsync,
  getAllPlanListAsync,
  getPlanByUserIdAsync,
} from '@redux/services';
import { PATH_DASHBOARD } from '@routes/paths';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

DietPlanForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentDietPlan: PropTypes.object,
};

export default function DietPlanForm({ isEdit = false, isView = false, currentDietPlan }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState('');
  const { planByUser } = useSelector((store) => store?.plan);
  const { users } = useSelector((store) => store?.users);

  const ErrorMessage = styled('div')({
    color: '#FF5722',
    fontSize: '12px',
  });

  const DietPlanSchema = Yup.object().shape({
    userId: Yup.object().required('User is required.'),
    planId: Yup.object().required('Plan is required.'),
    phase: Yup.object().required('Phase is required.'),
    pdfReport: Yup.mixed().test('fileOrURL', 'Select a PDF (max 100MB)', (value) => {
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

  const defaultPhaseOption = phases.find((option) => option.name === currentDietPlan?.phase);
  const defaultValues = useMemo(
    () => ({
      userId: currentDietPlan?.userId || null,
      planId: currentDietPlan?.planId || null,
      phase: defaultPhaseOption || null,
      pdfReport: currentDietPlan?.pdfReport || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDietPlan, phases]
  );
  const methods = useForm({
    resolver: yupResolver(DietPlanSchema),
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
    if (values.userId) {
      setUser(values?.userId?._id);
      if (!currentDietPlan) {
        setValue('planId', null);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);
  useEffect(() => {
    if ((isEdit && currentDietPlan) || (isView && currentDietPlan)) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentDietPlan]);

  const onSubmit = async (data) => {
    if (!data.pdfReport) {
      enqueueSnackbar('Diet Plan Report is required.', { variant: 'error' });
      return;
    }
    const formData = new FormData();
    formData.append('userId', data.userId._id);
    formData.append('planId', data.planId._id);
    formData.append('phase', data.phase.name);
    data?.pdfReport.forEach((file, index) => {
      formData.append('pdfReport', file);
    });

    try {
      const response = await dispatch(
        isEdit
          ? updateDietPlanAsync({ id: currentDietPlan?._id, data: formData })
          : postDietPlanCreateAsync(formData)
      );
      // If response is a success -
      if (response?.payload?.data?.success) {
        enqueueSnackbar(isEdit ? 'Updated Successfully!' : 'Created Successfully!');
        navigate(PATH_DASHBOARD.dietplan.list);
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
      // methods.trigger('pdfReport');
    },
    [setValue, values.pdfReport]
  );

  const handleRemoveFile = (inputFile) => {
    if (!isView) {
      const filtered = values.pdfReport && values.pdfReport?.filter((file) => file !== inputFile);
      setValue('pdfReport', filtered);
    }
  };

  useEffect(() => {
    const query = { status: 'Paid' };
    dispatch(getUsersAsync(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  useEffect(() => {
    if (user) {
      dispatch(getPlanByUserIdAsync({ id: user }));
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
                      option.mobile
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
              label="Plan"
              options={values.userId ? planByUser : []} // Only show options if userId is selected
              getOptionLabel={(option) =>
                option && option.title
                  ? option.title.replace(/\b\w/g, (char) => char.toUpperCase())
                  : ''
              }
              isOptionEqualToValue={(option, value) => option._id === value._id}
            />
            <RHFAutocomplete
              disabled={isView}
              name="phase"
              label="Phase"
              options={phases}
              getOptionLabel={(option) =>
                option && option.name
                  ? option.name.replace(/\b\w/g, (char) => char.toUpperCase())
                  : ''
              }
              isOptionEqualToValue={(option, value) => option.name === value.name}
            />
            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Diet Plan Report
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
                {!isEdit ? 'Create Diet Plan' : 'Save Changes'}
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

const type = [
  {
    _id: 1,
    name: 'Ram',
  },
  {
    _id: 2,
    name: 'Shyam',
  },
];

const phases = [
  {
    name: 'Detoxification',
  },
  {
    name: 'Pseudocereal',
  },
  {
    name: 'High protein',
  },
  {
    name: 'Super food',
  },
  {
    name: 'Partial detoxification',
  },
  {
    name: 'Carb cycling',
  },
  {
    name: 'Grain change',
  },
  {
    name: 'Anti inflammatory',
  },
  {
    name: 'Super carb',
  },
  {
    name: 'AIP ( auto immune protocol phase )',
  },
  {
    name: 'Intermittent',
  },
  {
    name: 'Plant based',
  },
];
