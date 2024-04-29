import FormProvider from '@components/hook-form';
import { useSnackbar } from '@components/snackbar';
import { Button, DialogActions, DialogContent, TextField } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { updateLeaveStatusAsync } from '@redux/services';

ApproveRejectForm.propTypes = {
  id: PropTypes.string,
  status: PropTypes.string,
  handleCloseEdit: PropTypes.func,
};

export default function ApproveRejectForm({ id, status, handleCloseEdit }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  console.log('status', status)
  const ApproveRejectSchema = Yup.object().shape({
    comments: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      comments: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(ApproveRejectSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const payload = {
        status,
        comments: data.comments,
      };
      const response = await dispatch(updateLeaveStatusAsync({id, data: payload}));
      if (response?.payload?.success) {
        enqueueSnackbar(`${status} successfully!`);
        handleCloseEdit();
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong!');
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <DialogContent sx={{ width: '600px' }}>
        <Controller
          name="comments"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              label="Add Comments"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              error={!!error}
              multiline
              rows={4}
              helperText={error ? error.message : null}
              sx={{ mt: 2, width: '100%' }}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          Confirm
        </LoadingButton>
        <Button variant="contained" color="warning" onClick={() => handleCloseEdit()}>
          Cancel
        </Button>
      </DialogActions>
    </FormProvider>
  );
}
