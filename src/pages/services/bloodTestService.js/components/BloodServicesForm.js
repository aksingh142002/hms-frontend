import FormProvider, { RHFTextField } from '@components/hook-form';
import Iconify from '@components/iconify';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, InputAdornment, Stack, Typography } from '@mui/material';
import { postServiceCreateAsync, updateBloodServiceAsync } from '@redux/services';
import { PATH_DASHBOARD } from '@routes/paths';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

BloodServicesForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentBlood: PropTypes.object,
};

export default function BloodServicesForm({ isEdit = false, isView = false, currentBlood }) {
  const { isLoading } = useSelector((store) => store?.service);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const UserSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    noOfTests: Yup.string().required('No. of Test is required'),
    testMode: Yup.string().required('Test Mode is required'),
    sampleRequired: Yup.string().required('Sample is required'),
    preparations: Yup.string().required('Preparations  is required'),
    shortDesc: Yup.string().required('Short Description is required'),
    longDesc: Yup.string().required('Long Description is required'),
    discountPrice: Yup.string().required('Discount Price is required'),
    basePrice: Yup.string()
      .required('Base Price is required')
      .when(['discountPrice'], (discountPrice, schema) =>
        discountPrice
          ? schema.test({
              test: (basePrice) => parseFloat(basePrice) > parseFloat(discountPrice),
              message: 'Base Price must be greater than Discount Price',
            })
          : schema
      ),
    testIncludes: Yup.array().of(
      Yup.object({
        name: Yup.string().required('Symptom is required.'),
      })
    ),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentBlood?.title || '',
      noOfTests: currentBlood?.noOfTests || '',
      testMode: currentBlood?.testMode || '',
      sampleRequired: currentBlood?.sampleRequired || '',
      preparations: currentBlood?.preparations || '',
      shortDesc: currentBlood?.shortDesc || '',
      longDesc: currentBlood?.longDesc || '',
      discountPrice: currentBlood?.discountPrice || '',
      basePrice: currentBlood?.basePrice || '',
      testIncludes: currentBlood?.testIncludes
        ? currentBlood.testIncludes.map((name) => ({ name }))
        : [{ name: '' }],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentBlood]
  );

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if ((isEdit && currentBlood) || (isView && currentBlood)) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentBlood]);

  const onSubmit = async (value) => {
    const testIncludes = value?.testIncludes?.map((item) => item?.name);

    const type = 'blood test';
    const data = {
      ...value,
      testIncludes,
      type,
    };
    try {
      const response = await dispatch(
        isEdit
          ? updateBloodServiceAsync({ id: currentBlood?._id, data })
          : postServiceCreateAsync(data)
      );
      if (response?.payload?.success) {
        enqueueSnackbar(
          isEdit
            ? 'Blood Test service Updated successfully!'
            : 'Blood Test Service Created successfully!'
        );
        navigate(PATH_DASHBOARD.bloodservices.list);
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

  const {
    fields: symptomsFields,
    append: appendSymptom,
    remove: removeSymptom,
  } = useFieldArray({
    control: methods.control,
    name: 'testIncludes',
  });

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
            <RHFTextField disabled={isView} name="noOfTests" type="number" label="No. of Test" />
            <RHFTextField disabled={isView} name="testMode" label="Test Mode" />
            <RHFTextField disabled={isView} name="sampleRequired" label="Required Sample" />
            <RHFTextField disabled={isView} name="preparations" label="Preparations" />
            <RHFTextField disabled={isView} name="basePrice" type="number" label="Base Price" />
            <RHFTextField
              disabled={isView}
              name="discountPrice"
              type="number"
              label="Discount Price"
            />

            {symptomsFields.map((field, index) => (
              <div key={field.id}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} />
                <RHFTextField
                  name={`testIncludes[${index}].name`}
                  label="Test Included"
                  defaultValue={field.name}
                  disabled={isView}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {symptomsFields.length !== 0 && (
                          <div>
                            {index !== 0 || symptomsFields.length > 1 ? (
                              <Iconify
                                icon="eva:trash-2-outline"
                                onClick={() => removeSymptom(index)}
                                style={{
                                  cursor: 'pointer',
                                  marginRight: '10px',
                                }}
                              />
                            ) : null}
                            {symptomsFields.length - 1 === index && (
                              <Iconify
                                icon="eva:plus-fill"
                                onClick={() => appendSymptom({ name: '' })}
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
          <Box
            marginTop={3}
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField
              disabled={isView}
              name="shortDesc"
              label="Short Description"
              multiline
              rows={3}
            />
            <RHFTextField
              disabled={isView}
              name="longDesc"
              label="Long Description"
              multiline
              rows={3}
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
                {!isEdit ? 'Create Services' : 'Save Changes'}
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
