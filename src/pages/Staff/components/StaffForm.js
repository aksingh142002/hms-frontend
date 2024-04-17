import FormProvider, { RHFAutocomplete, RHFMultiSelect, RHFTextField } from '@components/hook-form';
import Iconify from '@components/iconify';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  InputAdornment,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  getRoleListAsync,
  getSymptomAsync,
  postStaffCreateAsync,
  updateStaffAsync,
} from '@redux/services';
import { PATH_DASHBOARD } from '@routes/paths';
import { options } from 'numeral';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import UploadBox from '@components/upload/CustomUpload/UploadBox';

StaffForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentStaff: PropTypes.object,
};

export default function StaffForm({ isEdit = false, isView = false, currentStaff }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const validateImageFileType = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    return allowedTypes.includes(file.type);
  };

  const { allRoleData } = useSelector((store) => store?.role);
  const { isLoading } = useSelector((store) => store?.staff);

  const StaffSchema = Yup.object().shape({
    name: Yup.string().required('Name is required.'),
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
    mobileNumber: Yup.string()
      .required('Mobile number is required ')
      .test('mobile-error', 'Mobile number must be 10 digit.', (value) => {
        if (String(value)?.length === 10) return true;
        return false;
      }),
    email: Yup.string()
      .required('Email is required.')
      .email('Email must be a valid email address.'),
    password: !isEdit ? Yup.string().required('Password is required.') : '',
    role: Yup.object().required('Role is required.'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentStaff?.name,
      image: currentStaff?.image || [],
      role: currentStaff?.role || null,
      mobileNumber: currentStaff?.mobileNumber || '',
      email: currentStaff?.email || '',
    }),
    [currentStaff]
  );
  const methods = useForm({
    resolver: yupResolver(StaffSchema),
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

  const roleType = watch('role');
  const values = getValues();

  const [selectedValues, setSelectedValues] = useState([]);

  const handleChange = (event, newValue) => {
    setSelectedValues(newValue);
  };

  useEffect(() => {
    if ((isEdit && currentStaff) || (isView && currentStaff)) {
      reset(defaultValues);
      setImageFiles(currentStaff?.image ? [{ preview: currentStaff.image }] : []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentStaff]);

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(' ');
  const handleDrop = useCallback(
    (acceptedFiles) => {
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
    },
    [methods, setValue]
  );

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('role', data.role._id);
    formData.append('email', data.email);
    formData.append('mobileNumber', data.mobileNumber);
    formData.append('password', data.password);
    if (data.image && data.image[0] instanceof File) {
      formData.append('image', data.image[0]);
    } else if (currentStaff?.image) {
      formData.append('image', data.image);
    }
    try {
      const response = await dispatch(
        isEdit
          ? updateStaffAsync({ id: currentStaff?._id, data: formData })
          : postStaffCreateAsync(formData)
      );
      if (response?.payload?.data?.success) {
        enqueueSnackbar(isEdit ? 'Staff Update successfully!' : 'Staff Created successfully!');
        navigate(PATH_DASHBOARD.staff.list);
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

  useEffect(() => {
    if (currentStaff?.image) {
      setImageFiles([currentStaff.image]);
      setValue('image', [currentStaff?.image]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStaff]);

  useEffect(() => {
    dispatch(getRoleListAsync());
  }, [dispatch]);

  return (
    <>
      {' '}
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
          <CircularProgress color="primary" />{' '}
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
                <RHFTextField disabled={isView} name="name" label="Name" />
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
                </Box>
                <Controller
                  name="mobileNumber"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <RHFTextField
                      {...field}
                      label="Mobile Number"
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
                <RHFTextField disabled={isView} name="email" label="Email" />
                {!isEdit && !isView && (
                  <RHFTextField disabled={isView} name="password" label="Password" />
                )}
                <RHFAutocomplete
                  disabled={isView}
                  name="role"
                  label="Role"
                  options={allRoleData}
                  getOptionLabel={(option) =>
                    option && option.roleName
                      ? option.roleName.replace(/\b\w/g, (char) => char.toUpperCase())
                      : ''
                  }
                  isOptionEqualToValue={(option, value) => option._id === value._id}
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
                    {!isEdit ? 'Create Staff' : 'Save Changes'}
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
