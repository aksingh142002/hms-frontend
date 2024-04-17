import FormProvider, { RHFTextField, RHFAutocomplete } from '@components/hook-form';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, InputAdornment } from '@mui/material';
import { postServiceCreateAsync, } from '@redux/services/service';
import { PATH_DASHBOARD } from '@routes/paths';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Iconify from '@components/iconify/Iconify';

DocServicesForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentservice: PropTypes.object,
};

export default function DocServicesForm({ isEdit = false, isView = false, currentservice }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const UserSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    consultationMode: Yup.string().required('Consultation Mode is required'),
    // preparations: Yup.string().required('Preparations  is required'),
    preparations: Yup.array().of(
      Yup.object({
        name: Yup.string().required('Prepartion is Required'),
      })
    ),
    shortDesc: Yup.string().required('Short Description is required'),
    longDesc: Yup.string().required('Long Description is required'),
    discountPrice: Yup.string().required('Discount Price is required'),
    duration: Yup.object().required('Duration is required'),
    basePrice: Yup.string()
      .required('Base Price is required')
      .when('discountPrice', (discountPrice, schema) => (
        schema.test({
          test: (basePrice) => parseFloat(basePrice) > parseFloat(discountPrice),
          message: 'Base Price must be greater than Discount Price',
        })
      )),
  });
  
  const defaultDurationOption = timeSlot.find(option => option.value === currentservice?.duration);
  const defaultValues = useMemo(
    () => ({
      title: currentservice?.title || '',
      consultationMode: currentservice?.consultationMode || '',
      // preparations: currentservice?.preparations || '',
      preparations: currentservice?.preparations
        ? currentservice?.preparations.map((name) => ({ name }))
        : [{ name: '' }],
      shortDesc: currentservice?.shortDesc || '',
      longDesc: currentservice?.longDesc || '',
      discountPrice: currentservice?.discountPrice || "",
      basePrice: currentservice?.basePrice || "",
      duration: defaultDurationOption || null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentservice,timeSlot]
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
    if ((isEdit && currentservice) || (isView && currentservice)) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentservice]);

  const onSubmit = async (value) =>
  {
    const preparations = value?.preparations?.map((item) => item?.name);
    const data = {
      ...value,
      preparations,
      duration: value.duration.value,
      type: "ayurvedic doctor",
    }
    try {
      await dispatch(
        postServiceCreateAsync(data)
      );
      // If response is a success -
      reset();
      enqueueSnackbar(isEdit ? 'Update success!' : 'Create success!');
      navigate(PATH_DASHBOARD.docservices.list);
    } catch (error) {
      enqueueSnackbar('Something went wrong!');
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };
  const {
    fields: preparationsField,
    append: appendPreparations,
    remove: removePreparations,
  } = useFieldArray({
    control: methods.control,
    name: 'preparations',
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
            <RHFTextField disabled={isView} name="consultationMode" label="Consultation Mode" />
            {/* <RHFTextField disabled={isView} name="preparations" label="Preparations" /> */}
            {preparationsField.map((field, index) => (
              <div key={field.id} disabled={isView}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }} />
                <RHFTextField
                  name={`preparations[${ index }].name`}
                  label="Preparations"
                  defaultValue={field.name}
                  disabled={isView}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" disabled={isView}>
                        {preparationsField.length !== 0 && (
                          <div>
                            {index !== 0 || preparationsField.length > 1 ? (
                              <Iconify
                                icon="eva:trash-2-outline"
                                onClick={() => removePreparations(index)}
                                style={{
                                  cursor: 'pointer',
                                  marginRight: '10px',
                                }}
                              />
                            ) : null}
                            {preparationsField.length - 1 === index && (
                              <Iconify

                                icon="eva:plus-fill"
                                onClick={() => appendPreparations({ name: '' })}
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
            <RHFTextField disabled={isView} type='number' name="basePrice" label="Base Price" />
            <RHFTextField disabled={isView} type='number' name="discountPrice" label="Discount Price" />
            <RHFAutocomplete disabled={isView} name="duration" label="Duration" options={timeSlot}
              getOptionLabel={(option) =>
              option && option.label
                ? option.label.replace(/\b\w/g, (char) => char.toUpperCase())
                : ''
              }
              isOptionEqualToValue={(option, value) => option?.value === value?.value}
            />
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
            <RHFTextField disabled={isView} name="shortDesc" label="Short Description"
              multiline
              rows={3} />
            <RHFTextField disabled={isView} name="longDesc" label="Long Description"
              multiline
              rows={3} />
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
  );
}

const timeSlot = [

  {
    label: '15min (standard)',
    value: 15,
  },
  {
    label: '30min',
    value: 30,
  },
  {
    label: '45min',
    value: 45,
  },
  {
    label: '60min',
    value: 60,
  }
]
