/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Box, Card, Grid, Stack, Typography, InputAdornment } from '@mui/material';
import FormProvider, { RHFTextField } from '@components/hook-form';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { postPlanCreateAsync, updatePlanAsync } from '@redux/services';
import { PATH_DASHBOARD } from '@routes/paths';
import PropTypes from 'prop-types';
import { useForm, useFieldArray } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import UploadBox from '@components/upload/CustomUpload/UploadBox';
import { styled } from '@mui/material/styles';
import Iconify from '@components/iconify/Iconify';
import PackageIncludes from './PackageInclude';
import OtherDetails from './OtherDetailsForm';

PackageForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentPackage: PropTypes.object,
};

export default function PackageForm({ isEdit = false, isView = false, currentPackage }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const [imageFiles, setImageFiles] = useState(currentPackage?.image || []);
  const [imagePreview, setImagePreview] = useState(' ');

  const [submitClicked, setSubmitClicked] = useState(false);

  const [bookPriceArray, setBookPriceArray] = useState([]);
  const [otherDetailsData, setOtherDetailsData] = useState([]);
  // Helper function to validate image file type
  const validateImageFileType = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    return allowedTypes.includes(file.type);
  };

  const UserSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    shortDescription: Yup.string().required('Short Description is required'),
    longDescription: Yup.string().required('Long Description is required'),
    discountPrice: Yup.string().required('Discount Price is required'),
    basePrice: Yup.string()
      .required('Base Price is required')
      .when('discountPrice', (discountPrice, schema) =>
        schema.test({
          test: (basePrice) => parseFloat(basePrice) > parseFloat(discountPrice),
          message: 'Base Price must be greater than Discount Price',
        })
      ),
    duration: Yup.string().required('Plan Duration is required'),
    benefits: Yup.array().of(
      Yup.object({
        name: Yup.string().required('Benefits is Required'),
      })
    ),
    thumbnailImage: Yup.mixed().test('fileOrURL', 'Select a valid Image (max 1MB)', (value) => {
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
      thumbnailImage: currentPackage?.thumbnailImage || [],
      title: currentPackage?.title || '',
      // month: currentPackage?.month || '',
      discountPrice: currentPackage?.discountPrice || '',
      shortDescription: currentPackage?.shortDescription || '',
      longDescription: currentPackage?.longDescription || '',
      basePrice: currentPackage?.basePrice || '',
      duration: currentPackage?.duration || '',
      benefits: currentPackage?.benefits
        ? currentPackage?.benefits.map((name) => ({ name }))
        : [{ name: '' }],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPackage]
  );

  const ErrorMessage = styled('div')({
    color: '#FF5722',
    fontSize: '12px',
  });

  const methods = useForm({
    resolver: yupResolver(UserSchema),
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

  const values = getValues();

  useEffect(() => {
    if ((isEdit && currentPackage) || (isView && currentPackage)) {
      reset(defaultValues);
      setImageFiles(
        currentPackage?.thumbnailImage ? [{ preview: currentPackage?.thumbnailImage }] : []
      );
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentPackage]);

  const onSubmit = async (value) => {
    // const otherDetails = otherDetailsData;
    const packageIncludes = bookPriceArray;
    const benefits = value?.benefits?.map((item) => item?.name);

    const formData = new FormData();

    formData.append('title', value.title);
    formData.append('longDescription', value.longDescription);
    formData.append('shortDescription', value.shortDescription);
    formData.append('basePrice', value.basePrice);
    formData.append('discountPrice', value.discountPrice);
    formData.append('thumbnailImage', value.thumbnailImage[0]);
    formData.append('duration', value.duration);
    // Append additional fields from the second function
    // formData.append('otherDetails', JSON.stringify(otherDetails));
    formData.append('packageIncludes', JSON.stringify(packageIncludes));
    formData.append('benefits', JSON.stringify(benefits));

    try {
      const response = await dispatch(
        isEdit
          ? updatePlanAsync({ id: currentPackage?._id, data: formData })
          : postPlanCreateAsync(formData)
      );
      if (response?.payload?.data?.success) {
        enqueueSnackbar(isEdit ? 'Plan Update successfully!' : 'Plan Created successfully!');
        navigate(PATH_DASHBOARD.package.list);
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

  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    if (file) {
      setImageFiles([newFile]);
      setImagePreview(newFile.preview);
      setValue('thumbnailImage', [newFile]);
    }
  });

  const handleImageValidate = () => {
    // Set submitClicked to true to show the error message
    setSubmitClicked(true);
  };

  const handleClick = () => {
    handleImageValidate();
    handleSubmit(onSubmit)();
  };

  const {
    fields: benefitsFields,
    append: appendBenefits,
    remove: removeBenefits,
  } = useFieldArray({
    control: methods.control,
    name: 'benefits',
  });

  useEffect(() => {
    if (currentPackage?.thumbnailImage) {
      setImageFiles([currentPackage.thumbnailImage]);
      setValue('thumbnailImage', [currentPackage?.thumbnailImage]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPackage]);
  return (
    <>
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
              <Stack>
                {/* <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Thumbnail (380px X 200px)
                  </Typography> */}
                <Box>
                  <UploadBox
                    disabled={isView}
                    height={58}
                    name="thumbnailImage"
                    label="Image (max 1MB)"
                    accept={{
                      'image/*': [],
                    }}
                    onDrop={handleDrop}
                    file={imageFiles[0]}
                    error={
                      Boolean(errors.thumbnailImage) &&
                      (!values.thumbnailImage || values.thumbnailImage.length === 0)
                    }
                  />
                  {errors.thumbnailImage && values.thumbnailImage && (
                    <Typography color="error" variant="caption">
                      {errors.thumbnailImage.message}
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
                {/* Display error message conditionally */}
                {submitClicked && imageFiles.length === 0 && (
                  <ErrorMessage>Required Field.</ErrorMessage>
                )}
              </Stack>
              <RHFTextField disabled={isView} name="title" label="Title" />
              {/* <RHFTextField disabled={isView} name="month" label="Month" /> */}

              <RHFTextField disabled={isView} name="basePrice" label="Base Price" type="number" />

              <RHFTextField
                disabled={isView}
                name="discountPrice"
                label="Discount Price"
                type="number"
              />

              <RHFTextField
                disabled={isView}
                name="shortDescription"
                label="Short Description"
                multiline
                rows={3}
              />
              <RHFTextField
                disabled={isView}
                name="longDescription"
                label="Long Description"
                multiline
                rows={3}
              />
              <RHFTextField
                disabled={isView}
                name="duration"
                label="Plan Duration ( Months )"
                type="number"
              />

              {benefitsFields.map((field, index) => (
                <div key={field.id} disabled={isView}>
                  <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} />
                  <RHFTextField
                    name={`benefits[${index}].name`}
                    label="Benefits"
                    defaultValue={field.name}
                    disabled={isView}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" disabled={isView}>
                          {benefitsFields.length !== 0 && (
                            <div>
                              {index !== 0 || benefitsFields.length > 1 ? (
                                <Iconify
                                  icon="eva:trash-2-outline"
                                  onClick={() => removeBenefits(index)}
                                  style={{
                                    cursor: 'pointer',
                                    marginRight: '10px',
                                  }}
                                />
                              ) : null}
                              {benefitsFields.length - 1 === index && (
                                <Iconify
                                  icon="eva:plus-fill"
                                  onClick={() => appendBenefits({ name: '' })}
                                  style={{
                                    cursor: 'pointer',
                                  }}
                                />
                              )}
                            </div>
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              ))}
            </Box>
          </Card>
        </Grid>
      </FormProvider>
      <PackageIncludes
        isEdit={isEdit}
        isView={isView}
        bookPriceArray={bookPriceArray}
        setBookPriceArray={setBookPriceArray}
        currentBook={currentPackage?.packageIncludes}
      />
      {/* <OtherDetails
        isEdit={isEdit}
        isView={isView}
        otherDetailsData={otherDetailsData}
        setOtherDetailsData={setOtherDetailsData}
        currentBook={currentPackage?.otherDetails}
      /> */}

      {isView ? (
        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton onClick={handleBack} type="button" variant="contained">
            Back
          </LoadingButton>
        </Stack>
      ) : (
        <Stack gap="10px" justifyContent="flex-end" flexDirection="row" sx={{ mt: 3 }}>
          <LoadingButton
            // type="submit"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting}
            // eslint-disable-next-line no-unneeded-ternary
            // disabled={bookPriceArray?.length === 0 || formDataArray?.length === 0}
          >
            {!isEdit ? 'Create Plan' : 'Save Changes'}
          </LoadingButton>

          {isEdit && (
            <LoadingButton onClick={handleBack} type="button" variant="contained" color="error">
              Cancel
            </LoadingButton>
          )}
        </Stack>
      )}
    </>
  );
}
