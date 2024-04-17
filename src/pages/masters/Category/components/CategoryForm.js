import FormProvider, { RHFTextField } from '@components/hook-form';
// import Iconify from '@components/iconify';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { addCategoryAsync, updateCategoryAsync } from '@redux/services/categoryService';
import { PATH_DASHBOARD } from '@routes/paths';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

CategoryForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentCategory: PropTypes.object,
};

export default function CategoryForm({ isEdit = false, isView = false, currentCategory }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const [categoryRole, setcategoryRole] = useState(currentCategory?.category || '');

  const UserSchema = Yup.object().shape({
    category: Yup.string().required('Category is required.'),
  });

  const defaultValues = useMemo(
    () => ({
      category: currentCategory?.category || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCategory]
  );

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const {
    reset,
    // watch,
    // control,
    // setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const roleType = watch('type');

  // const {
  //   fields: symptomsFields,
  //   append: appendSymptom,
  //   remove: removeSymptom,
  // } = useFieldArray({
  //   control: methods.control,
  //   name: 'symptom',
  // });

  // const values = watch();

  useEffect(() => {
    if ((isEdit && currentCategory) || (isView && currentCategory)) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentCategory]);

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(
        isEdit ? updateCategoryAsync({ id: currentCategory?._id, data }) : addCategoryAsync(data)
      );
      // If response is a success -

      reset();
      enqueueSnackbar(isEdit ? 'Update success!' : 'Create success!');
      navigate(PATH_DASHBOARD.category.list);
    } catch (error) {
      enqueueSnackbar('Something went wrong!');
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // useEffect(() => {
  //   setcategoryRole(roleType?.name);
  // }, [roleType]);

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
            <RHFTextField disabled={isView} name="category" label="Category" />
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
                {!isEdit ? 'Create Category' : 'Save Changes'}
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
