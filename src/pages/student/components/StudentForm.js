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
  postStudentCreateAsync,
  updateStudentAsync,
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

StudentForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentStudent: PropTypes.object,
};

export default function StudentForm({ isEdit = false, isView = false, currentStudent }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const validateImageFileType = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    return allowedTypes.includes(file.type);
  };
  const allRoleData = ['hostel staff', 'admin'];
  // const { allRoleData } = useSelector((store) => store?.role);
  const { isLoading } = useSelector((store) => store?.student);

  const StudentSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required.'),
    lastName: Yup.string().required('Last Name is required.'),
    avatar: Yup.mixed().test('fileOrURL', 'Select a valid avatar (max 1MB)', (value) => {
      if (isEdit) {
        // If in edit mode, check if the value is a valid URL (HTTPS link) or a valid avatar
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
      // If not in edit mode, check if a file is uploaded and if it's a valid avatar
      return (
        value &&
        value[0] instanceof File &&
        validateImageFileType(value[0]) &&
        value[0].size <= 1048576
        // (typeof value[0] === 'string' && validateImageURL(value[0]))
      );
    }),
    phoneNumber: Yup.string()
      .required('Mobile number is required ')
      .test('mobile-error', 'Mobile number must be 10 digit.', (value) => {
        if (String(value)?.length === 10) return true;
        return false;
      }),
    email: Yup.string()
      .required('Email is required.')
      .email('Email must be a valid email address.'),
    password: !isEdit ? Yup.string().required('Password is required.') : '',
    role: Yup.string().required('Role is required.'),
  });

  const defaultValues = useMemo(
    () => ({
      firstName: currentStudent?.firstName,
      lastName: currentStudent?.lastName,
      avatar: currentStudent?.avatar || [],
      role: currentStudent?.role || null,
      phoneNumber: currentStudent?.phoneNumber || '',
      email: currentStudent?.email || '',
    }),
    [currentStudent]
  );
  const methods = useForm({
    resolver: yupResolver(StudentSchema),
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
    if ((isEdit && currentStudent) || (isView && currentStudent)) {
      reset(defaultValues);
      setImageFiles(currentStudent?.avatar ? [{ preview: currentStudent.avatar }] : []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentStudent]);

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
        setValue('avatar', [newFile]);
      }
      methods.trigger('avatar');
    },
    [methods, setValue]
  );

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('role', data.role);
    formData.append('email', data.email);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('password', data.password);
    if (data.avatar && data.avatar[0] instanceof File) {
      formData.append('avatar', data.avatar[0]);
    } else if (currentStudent?.avatar) {
      formData.append('avatar', data.avatar);
    }
    try {
      const response = await dispatch(
        isEdit
          ? updateStudentAsync({ id: currentStudent?._id, data: formData })
          : postStudentCreateAsync(formData)
      );
      if (response?.payload?.data?.success) {
        enqueueSnackbar(isEdit ? 'Student Update successfully!' : 'Student Created successfully!');
        navigate(PATH_DASHBOARD.student.list);
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
    if (currentStudent?.avatar) {
      setImageFiles([currentStudent.avatar]);
      setValue('avatar', [currentStudent?.avatar]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStudent]);

  // useEffect(() => {
  //   dispatch(getRoleListAsync());
  // }, [dispatch]);

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
                <RHFTextField disabled={isView} name="firstName" label="First Name" />
                <RHFTextField disabled={isView} name="lastName" label="last Name" />
                <Box>
                  <UploadBox
                    disabled={isView}
                    height={58}
                    name="avatar"
                    label="Avatar (max 1MB)"
                    accept={{
                      'image/*': [],
                    }}
                    onDrop={handleDrop}
                    file={imageFiles[0]}
                    error={Boolean(errors.avatar) && (!values.avatar || values.avatar.length === 0)}
                  />
                  {errors.avatar && values.avatar && (
                    <Typography color="error" variant="caption">
                      {errors.avatar.message}
                    </Typography>
                  )}
                </Box>
                <Controller
                  name="phoneNumber"
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
                    option && option ? option.replace(/\b\w/g, (char) => char.toUpperCase()) : ''
                  }
                  isOptionEqualToValue={(option, value) => option === value}
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
                    {!isEdit ? 'Create Student' : 'Save Changes'}
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
