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
import { postDietPlanNotesAsync } from '@redux/services';

DietPlanNotes.propTypes = {
  row: PropTypes.object,
  handleCloseEdit: PropTypes.func,
};

export default function DietPlanNotes({ row, handleCloseEdit }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const DietPLanNotes = Yup.object().shape({
    notes: Yup.string().required('Notes are required.'),
  });

  const defaultValues = useMemo(
    () => ({
      dietId: row._id,
    }),
    [row]
  );

  const methods = useForm({
    resolver: yupResolver(DietPLanNotes),
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
        dietId: row._id,
        notes: data.notes,
      };
      const response = await dispatch(postDietPlanNotesAsync(payload));
      if (response?.payload?.success) {
        enqueueSnackbar('Add Note successfully!');
        handleCloseEdit();
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong!');
      console.error(error);
    }
  };

  return (
    <>
      <DialogTitle>Add Notes</DialogTitle>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ width: '600px' }}>
          <Controller
            name="notes"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                fullWidth
                label="Add Notes"
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
            Add Note
          </LoadingButton>
          <Button variant="contained" color="warning" onClick={() => handleCloseEdit()}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </>
  );
}
