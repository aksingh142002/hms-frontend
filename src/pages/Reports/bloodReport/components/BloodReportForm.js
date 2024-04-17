import FormProvider, { RHFTextField, RHFAutocomplete } from '@components/hook-form';
// import Iconify from '@components/iconify';
import { useSnackbar } from '@components/snackbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, InputAdornment, Stack, Typography } from '@mui/material';
import {
  addBloodReportAsync,
  getbloodReportAsync,
  updateBloodReportAsync,
  getServiceListAsync,
  getUsersAsync,
} from '@redux/services';
import { PATH_DASHBOARD } from '@routes/paths';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// import { getUsersAsync } from '@redux/services/usersService';
// import { getServiceListAsync } from '@redux/services';

BloodReportForm.propTypes = {
  isEdit: PropTypes.bool,
  isView: PropTypes.bool,
  currentBloodReport: PropTypes.object,
};
const DEFAULT_QUERY = { type: 'blood test' };
export default function BloodReportForm({ isEdit = false, isView = false, currentBloodReport }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { users } = useSelector((store) => store?.users);
  const { ServiceData } = useSelector((store) => store?.service);

  const UserSchema = Yup.object().shape({
    userId: Yup.object().required('User is required.'),
    bloodReportId: Yup.object().required('Blood Report is required.'),
  });
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const defaultValues = useMemo(
    () => ({
      userId: currentBloodReport?.userId || null,
      bloodReportId: currentBloodReport?.bloodReportId || null,
      hemoglobin: currentBloodReport?.hemoglobin || '',
      mcv: currentBloodReport?.mcv || '',
      mch: currentBloodReport?.mch || '',
      mchc: currentBloodReport?.mchc || '',
      esr: currentBloodReport?.esr || '',
      fasting: currentBloodReport?.fasting || '',
      pp: currentBloodReport?.pp || '',
      sgot: currentBloodReport?.sgot || '',
      sgpt: currentBloodReport?.sgpt || '',
      alkalinePhosphatase: currentBloodReport?.alkalinePhosphatase || '',
      ggt: currentBloodReport?.ggt || '',
      t3: currentBloodReport?.t3 || '',
      t4: currentBloodReport?.t4 || '',
      tsh: currentBloodReport?.tsh || '',
      totalCholesterol: currentBloodReport?.totalCholesterol || '',
      hdlChol: currentBloodReport?.hdlChol || '',
      ldlChol: currentBloodReport?.ldlChol || '',
      vldlChol: currentBloodReport?.vldlChol || '',
      triglycerides: currentBloodReport?.triglycerides || '',
      urea: currentBloodReport?.urea || '',
      serumCreatinine: currentBloodReport?.serumCreatinine || '',
      uricAcid: currentBloodReport?.uricAcid || '',
      totalCalcium: currentBloodReport?.totalCalcium || '',
      totalProteins: currentBloodReport?.totalProteins || '',
      serumAlbuminGlobulin: currentBloodReport?.serumAlbuminGlobulin || '',
      prolactinFasting: currentBloodReport?.prolactinFasting || '',
      insulinFasting: currentBloodReport?.insulinFasting || '',
      insulinPp: currentBloodReport?.insulinPp || '',
      vitaminD: currentBloodReport?.vitaminD || '',
      vitaminB12: currentBloodReport?.vitaminB12 || '',
      hba1c: currentBloodReport?.hba1c || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentBloodReport]
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
    if ((isEdit && currentBloodReport) || (isView && currentBloodReport)) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, isView, currentBloodReport]);

  const onSubmit = async (data) => {
    // const formData = new FormData();
    // formData.append('userId', data.userId._id);
    // formData.append('bloodReportId', data.bloodReportId._id);

    try {
      const response = await dispatch(
        isEdit
          ? updateBloodReportAsync({ id: currentBloodReport?._id, data })
          : addBloodReportAsync(data)
      );
      // If response is a success -
      if (response?.payload?.success) {
        enqueueSnackbar(isEdit ? 'Updated Successfully!' : 'Created Successfully!');
        navigate(PATH_DASHBOARD.bloodreport.list);
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
    const querys ={status: 'Paid'}
    dispatch(getUsersAsync(querys));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  useEffect(() => {
    dispatch(getServiceListAsync(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, query]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, mt: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFAutocomplete
                disabled={isView}
                name="userId"
                label="User"
                options={users}
                getOptionLabel={(option) =>
                    option && option.name
                    ?`${option.name.replace(/\b\w/g, (char) => char.toUpperCase())}  (${option.mobile})`
                      : ''
                  }
                isOptionEqualToValue={(option, value) => option._id === value._id}
              />
              <RHFAutocomplete
                disabled={isView}
                name="bloodReportId"
                label="Blood Test"
                options={ServiceData}
                getOptionLabel={(option) =>
                    option && option.title
                      ? option.title.replace(/\b\w/g, (char) => char.toUpperCase())
                      : ''
                  }
                isOptionEqualToValue={(option, value) => option._id === value._id}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5">BLOOD HAEMATOLOGY</Typography>
            <Box
              rowGap={3}
              columnGap={2}
              mt={4}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField type="number" name="hemoglobin" label="Hemoglobin" />

              <RHFTextField type="number" name="mcv" label="MCV" />
              <RHFTextField type="number" name="mch" label="MCH" />
              <RHFTextField type="number" name="mchc" label="MCHC" />
              <RHFTextField type="number" name="esr" label="ESR" />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5">BLOOD GLUCOSE</Typography>
            <Box
              rowGap={3}
              columnGap={2}
              mt={4}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField type="number" name="fasting" label="FASTING" />

              <RHFTextField type="number" name="pp" label="PP" />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5">LIVER FUNCTION TESTS</Typography>
            <Box
              rowGap={3}
              columnGap={2}
              mt={4}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField type="number" name="sgot" label="S.G.O.T" />

              <RHFTextField type="number" name="sgpt" label="S.G.P.T" />
              <RHFTextField type="number" name="alkalinePhosphatase" label="ALKALINE PHOSPHATASE" />
              <RHFTextField type="number" name="ggt" label="G.G.T.P" />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5">THYROID PROFILE</Typography>
            <Box
              rowGap={3}
              columnGap={2}
              mt={4}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField type="number" name="t3" label="T3" />

              <RHFTextField type="number" name="t4" label="T4" />
              <RHFTextField type="number" name="tsh" label="TSH" />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5">LIPID PROFILE</Typography>
            <Box
              rowGap={3}
              columnGap={2}
              mt={4}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField type="number" name="totalCholesterol" label="Total cholesterol" />

              <RHFTextField type="number" name="hdlChol" label="HDL-Chol" />
              <RHFTextField type="number" name="ldlChol" label="LDL-Chol" />
              <RHFTextField type="number" name="vldlChol" label="VLDL-Chol" />
              <RHFTextField type="number" name="triglycerides" label="TRIGLYCERIDES" />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5">KIDNEY FUNCTION TESTS</Typography>
            <Box
              rowGap={3}
              columnGap={2}
              mt={4}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField type="number" name="urea" label="UREA" />

              <RHFTextField type="number" name="serumCreatinine" label="SERUM,CREATININE" />
              <RHFTextField type="number" name="uricAcid" label="URIC ACID" />
              <RHFTextField type="number" name="totalCalcium" label="TOTAL CALCIUM" />
              <RHFTextField type="number" name="totalProteins" label="TOTAL PROTEINS" />
              <RHFTextField
                type="number"
                name="serumAlbuminGlobulin"
                label="SERUM ALBUM/GLOBULIN"
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5">IMMUNO ASSAYS</Typography>
            <Box
              rowGap={3}
              columnGap={2}
              mt={4}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField type="number" name="prolactinFasting" label="PROLACTIN (Fasting)" />

              <RHFTextField type="number" name="insulinFasting" label="INSULIN (Fasting)" />
              <RHFTextField type="number" name="insulinPp" label="INSULIN (PP)" />
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5">OTHERS</Typography>
            <Box
              rowGap={3}
              columnGap={2}
              mt={4}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField type="number" name="vitaminD" label="Vitamin D" />

              <RHFTextField type="number" name="vitaminB12" label="Vitamin B12" />
              <RHFTextField type="number" name="hba1c" label="HBA1C" />
            </Box>
          </Card>
        </Grid>
      </Grid>
      {isView ? (
        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton onClick={handleBack} type="button" variant="contained">
            Back
          </LoadingButton>
        </Stack>
      ) : (
        <Stack gap="10px" justifyContent="flex-end" flexDirection="row" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!isEdit ? 'Create Blood Report' : 'Save Changes'}
          </LoadingButton>

          {isEdit && (
            <LoadingButton onClick={handleBack} type="button" variant="contained" color="error">
              Cancel
            </LoadingButton>
          )}
        </Stack>
      )}
    </FormProvider>
  );
}
