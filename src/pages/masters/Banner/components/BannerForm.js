/* eslint-disable react-hooks/exhaustive-deps */
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
  RHFUpload,
  RHFRadioGroup,
} from '@components/hook-form';
import { useSnackbar } from '@components/snackbar';
import UploadBox from '@components/upload/CustomUpload/UploadBox';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
// import { getAllPlanListAsync } from '@redux/services';
// import { addUserAsync, updateUserAsync } from '@redux/services';
import { postBannerAsync, updateBannerAsync } from '@redux/services';
import { PATH_DASHBOARD } from '@routes/paths';
import { da } from 'date-fns/locale';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// -------------------------

const BANNER_TYPE = [
  {
    label: 'Image',
    value: 'image',
  },
  {
    label: 'Video',
    value: 'video',
  },
];

BannerForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentBanner: PropTypes.object,
};

export default function BannerForm({ isEdit = false, isView = false, currentBanner }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, planData } = useSelector((store) => store?.plan);
  const { enqueueSnackbar } = useSnackbar();
  const [banner, setBanner] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false);

  // Helper function to validate image file type
  const validateImageFileType = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    return allowedTypes.includes(file.type);
  };

  const BannerSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    type: Yup.string().required('Banner Type is Required.'),
    link: '',
    video: banner === 'video' ? Yup.string().required('Link is required') : '',
    image:
      banner === 'image'
        ? Yup.mixed().test('fileOrURL', 'Select a valid Image (max 1MB)', (value) => {
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
          })
        : '',
  });

  const defaultValues = useMemo(
    () => ({
      title: currentBanner?.title || '',
      description: currentBanner?.description || '',
      type: currentBanner?.type || '',
      video: banner === 'video' ? currentBanner?.link : '',
      image: currentBanner?.image || [],
      link: banner === 'image' ? currentBanner?.link : '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentBanner]
  );
  const methods = useForm({
    resolver: yupResolver(BannerSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    getValues,
    formState: { isSubmitting, errors },
  } = methods;

  const bannerType = watch('type');
  useEffect(() => {
    // Check if bannerType is initially defined
    if (bannerType) {
      setBanner(bannerType);
    }
  }, [bannerType]);

  useEffect(() => {
    if ((isEdit && currentBanner) || (isView && currentBanner)) {
      reset(defaultValues);
      setImageFiles(currentBanner?.image ? [{ preview: currentBanner?.image }] : []);
      if (currentBanner?.type === 'video') {
        setValue('video', currentBanner?.link);
      } else if (currentBanner?.type === 'image') {
        setValue('link', currentBanner?.link);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentBanner]);

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
    methods.trigger('image');
  });

  useEffect(() => {
    if (banner === 'image') {
      // Clear values for the 'Video' type fields
      setValue('video', '');
    } else if (banner === 'video') {
      // Clear values for the 'Image' type fields
      setValue('link', '');
      setValue('image', []);
      setImageFiles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [banner]);

  const handleImageValidate = () => {
    // Set submitClicked to true to show the error message
    setSubmitClicked(true);
  };

  const handleClick = () => {
    handleImageValidate();
    handleSubmit(onSubmit)();
  };

  useEffect(() => {
    if (currentBanner?.image) {
      setImageFiles([currentBanner.image]);
      setValue('image', [currentBanner?.image]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBanner]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('type', data.type);
    formData.append('link', banner === 'image' ? data.link : data.video);

    if (data.image && data.image[0] instanceof File) {
      formData.append('image', data.image[0]);
    } else if (currentBanner?.image) {
      formData.append('image', data.image);
    }

    try {
      const response = await dispatch(
        isEdit
          ? updateBannerAsync({ id: currentBanner?._id, data: formData })
          : postBannerAsync(formData)
      );
      if (response?.payload?.data?.success) {
        enqueueSnackbar(isEdit ? 'Update success!' : 'Create success!');
        navigate(PATH_DASHBOARD.banner.list);
        reset();
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong!');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const values = getValues();

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(' ');

  const handleRemoveFile = (inputFile) => {
    const filtered = values.image && values.image?.filter((file) => file !== inputFile);
    setValue('image', filtered);
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
            <RHFTextField disabled={isView} name="title" label="Title" />
            <RHFTextField disabled={isView} name="description" label="Description" />
            <Stack spacing={1}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Banner Type
              </Typography>

              <RHFRadioGroup row spacing={4} name="type" options={BANNER_TYPE} />
            </Stack>
          </Box>
          {bannerType === 'image' && (
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField disabled={isView} name="link" label="Link" />
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
                {errors.image && values.image && (
                  <Typography color="error" variant="caption">
                    {errors.image.message}
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
            </Box>
          )}
          {bannerType === 'video' && (
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField disabled={isView} name="video" label="Youtube Url" />
            </Box>
          )}
          {isView ? (
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton onClick={handleBack} type="button" variant="contained">
                Back
              </LoadingButton>
            </Stack>
          ) : (
            <Stack gap="10px" justifyContent="flex-end" flexDirection="row" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Banner' : 'Save Changes'}
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
