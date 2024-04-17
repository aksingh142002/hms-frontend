import FormProvider, { RHFTextField } from '@components/hook-form';
// import Iconify from '@components/iconify';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { addFAQAsync, updateFAQAsync } from '@redux/services';
import { PATH_DASHBOARD } from '@routes/paths';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

FaqForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentFAQ: PropTypes.object,
};

export default function FaqForm({ isEdit = false, isView = false, currentFAQ }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const FAQSchema = Yup.object().shape({
    question: Yup.string().required('Question is required.'),
    answer: '',
  });

  const defaultValues = useMemo(
    () => ({
      question: currentFAQ?.question || '',
      answer: currentFAQ?.answer || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentFAQ]
  );

  const methods = useForm({
    resolver: yupResolver(FAQSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if ((isEdit && currentFAQ) || (isView && currentFAQ)) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentFAQ]);

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(
        isEdit ? updateFAQAsync({ id: currentFAQ?._id, data }) : addFAQAsync(data)
      );
      // If response is a success -
      
      reset();
      enqueueSnackbar(isEdit ? 'Update success!' : 'Create success!');
      navigate(PATH_DASHBOARD.faq.list);
    } catch (error) {
      enqueueSnackbar('Something went wrong!');
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate(-1);
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
            <RHFTextField disabled={isView} name="question" label="Question" multiline rows={3} />
            <RHFTextField disabled={isView} name="answer" label="Answer" multiline rows={3} />
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
                {!isEdit ? 'Create FAQ' : 'Save Changes'}
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
