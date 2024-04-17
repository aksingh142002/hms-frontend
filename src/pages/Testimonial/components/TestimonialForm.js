/* eslint-disable react-hooks/exhaustive-deps */
import FormProvider, { RHFTextField, RHFAutocomplete } from '@components/hook-form';
import { useSnackbar } from '@components/snackbar';
import UploadBox from '@components/upload/CustomUpload/UploadBox';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { getAllPlanListAsync } from '@redux/services';
// import { addUserAsync, updateUserAsync } from '@redux/services';
import { postTestimonialAsync, updateTestimonialAsync } from '@redux/services/testimonialService';
import { PATH_DASHBOARD } from '@routes/paths';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

TestimonialForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentTestimonial: PropTypes.object,
};

export default function TestimonialForm({ isEdit = false, isView = false, currentTestimonial }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateImageFileType = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    return allowedTypes.includes(file.type);
  };
  const { isLoading, planData } = useSelector((store) => store?.plan);
  const { enqueueSnackbar } = useSnackbar();
  
  const TestimonialSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    planId: Yup.object().required('Plan Taken  is required'),
    age: Yup.string().required('User Age is required'),
    weight: '',
    duration: Yup.string().required('Duration is required'),
    image: Yup.mixed().test('fileOrURL', 'Select a valid Image (max 1MB)', (value) => {
      if (isEdit) {
        // If in edit mode, check if the value is a valid URL (HTTPS link) or a valid image
        return (
          Yup.string()
            .url()
            .matches(/^https:/)
            .isValidSync(value[0]) ||
          (value &&
            value[0] instanceof File &&
            validateImageFileType(value[0]) &&
            value[0].size <= 1048576)
        );
      }
      // If not in edit mode, check if a file is uploaded and if it's a valid image
      return (
        value &&
        value[0] instanceof File &&
        validateImageFileType(value[0]) &&
        value[0].size <= 1048576
        // (typeof value[0] === 'string' && validateImageURL(value[0]))
      );
    }),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentTestimonial?.title || '',
      description: currentTestimonial?.description || '',
      planId: currentTestimonial?.planId || null,
      image: currentTestimonial?.image || [],
      age: currentTestimonial?.age || '',
      weight: currentTestimonial?.weight || '',
      duration: currentTestimonial?.duration || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTestimonial]
  );
  const methods = useForm({
    resolver: yupResolver(TestimonialSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    // control,
    setValue,
    handleSubmit,
    getValues,
    formState: { isSubmitting, errors },
  } = methods;

  const values = getValues();

  useEffect(() => {
    if ((isEdit && currentTestimonial) || (isView && currentTestimonial)) {
      reset(defaultValues);
      setImageFiles(currentTestimonial?.image ? [{ preview: currentTestimonial.image }] : []);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentTestimonial]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('planId', data.planId._id);
    // formData.append('image', data.image[0]);
    formData.append('age', data.age);
    formData.append('weight', data.weight);
    formData.append('duration', data.duration);

    if (data.image && data.image[0] instanceof File) {
      formData.append('image', data.image[0]);
    } else if (currentTestimonial?.image) {
      formData.append('image', data.image);
    }
    try {
      const response = await dispatch(
        isEdit
          ? updateTestimonialAsync({ id: currentTestimonial?._id, data: formData })
          : postTestimonialAsync(formData)
      );
      if (response?.payload?.data?.success) {
        enqueueSnackbar(isEdit ? 'Update success!' : 'Create success!');
        navigate(PATH_DASHBOARD.testimonial.list);
        reset();
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong!');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(' ');
  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    if (file) {
      setImageFiles([newFile]);
      setImagePreview(newFile.preview);
      setValue('image', [newFile]);
    }
  });

  useEffect(() => {
    if (currentTestimonial?.image) {
      setImageFiles([currentTestimonial.image]);
      setValue('image', [currentTestimonial?.image]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTestimonial]);

  useEffect(() => {
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
            <Box>
              <UploadBox
                disabled={isView}
                height={58}
                name="image"
                label="Image (max 1MB)"
                accept={{
                  'image/*': [],
                }}
                onDrop={handleDrop}
                file={imageFiles[0]}
                error={Boolean(errors.image) && (!values.image || values.image.length === 0)}
              />
              {methods.formState.errors.image && (
                <Typography color="error" variant="caption">
                  {errors.image && (!values.image || values.image.length === 0)
                    ? errors.image.message
                    : ''}
                </Typography>
              )}
              <Typography
                variant="body2"
                style={{ fontSize: '0.75rem', color: 'rgba(255, 0, 0, 0.5)' }}
              >
                {' '}
                Recommended Image size 1920X1080p
              </Typography>
            </Box>
            <RHFTextField disabled={isView} name="title" label="Title" />
            <RHFAutocomplete
              disabled={isView}
              name="planId"
              label="Plan Taken"
              options={planData}
              getOptionLabel={(option) =>
                    option && option.title
                      ? option.title.replace(/\b\w/g, (char) => char.toUpperCase())
                      : ''
                  }
              isOptionEqualToValue={(option, value) => option._id === value._id}
            />
            <RHFTextField disabled={isView} name="age" label="User Age (Years)" />
            <RHFTextField disabled={isView} name="weight" label="Weight Loss (Kg)" />
            <RHFTextField disabled={isView} name="duration" label="Duration (Months)" />
            <RHFTextField disabled={isView} name="description" label="Description" multiline rows={3} />
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
                {!isEdit ? 'Create Testimonial' : 'Save Changes'}
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
