import FormProvider, { RHFSelect, RHFTextField, RHFCheckbox } from '@components/hook-form';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack } from '@mui/material';
import { getRoleListAsync, postRoleAsync, updateRoleAsync } from '@redux/services';
import { PATH_DASHBOARD } from '@routes/paths';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

RoleForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentRole: PropTypes.object,
};

export default function RoleForm({ isEdit = false, isView = false, currentRole }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const {isLoading} = useSelector((store)=> store?.role)
  // const { isSubmitting } = useSelector((state) => state.role);


  // const { alert } = useSelector((state)=>state.role)
  const RoleSchema = Yup.object().shape({
    roleName: Yup.string().required('Role is required'),
  });

  const defaultValues = useMemo(
    () => ({
      roleName: currentRole?.roleName || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentRole]
  );

  const methods = useForm({
    resolver: yupResolver(RoleSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
  } = methods;

  useEffect(() => {
    if (isEdit && currentRole) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentRole]);

  const onSubmit = async (data) => {
    const payload = {
      roleName: data.roleName.toLowerCase(),
    }
    try {
      let response;
      if (!isEdit) {
        response = await dispatch(postRoleAsync(payload));
      } else {
        response = await dispatch(updateRoleAsync({id: currentRole?._id, data: payload}));
      }
      if (response?.payload?.success) {
        enqueueSnackbar(isEdit ? 'Role Updated successfully' : 'Role Created successfully',{variant: 'success'});
        navigate(PATH_DASHBOARD.role.list);
        reset();
        // navigate('/dashboard/role/list')
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="roleName" label="Role"  disabled={isView}/>
            </Box>

            {isView ? (
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton onClick={handleBack} type="button" variant="contained">
                  Back
                </LoadingButton>
              </Stack>
            ) : (
              <Stack gap="10px" justifyContent="flex-end" flexDirection="row" sx={{ mt: 3 }}>
                <LoadingButton type="submit" loading={isLoading} variant="contained">
                  {!isEdit ? 'Create Role' : 'Save Changes'}
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
      </Grid>
    </FormProvider>
  );
}
