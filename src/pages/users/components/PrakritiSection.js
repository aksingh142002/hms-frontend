import React, { useEffect, useState, useMemo } from 'react';
import FormProvider, { RHFAutocomplete, RHFSelect, RHFTextField } from '@components/hook-form';
import Button from '@mui/material/Button';
import {
  Box,
  Card,
  Container,
  Grid,
  Stack,
  MenuItem,
  CircularProgress,
  Typography,
  TextField,
} from '@mui/material';
import Iconify from '@components/iconify/Iconify';
import { LoadingButton } from '@mui/lab';
import PropTypes from 'prop-types';
import { useSnackbar } from '@components/snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import {
  getProfileByIdAsync,
  getAssessmentByIdAsync,
  updatePakritiByIdAsync,
  getPrakritiDataByIdAsync,
} from '@redux/services';
import moment from 'moment/moment';
import * as Yup from 'yup';
import { prakriti, assessment } from '../data';

PrakritiSection.propTypes = {
  id: PropTypes.string,
};

export default function PrakritiSection({ id }) {
  const dispatch = useDispatch();

  const { isLoadingPrakriti, prakritiById, prakritiPage, totalPrakritiPage } = useSelector(
    (store) => store?.userProfile
  );

  const [currentPage, setCurrentPage] = useState(1);

  // Prakriti Page Change
  const handlePrakritiNext = () => {
    dispatch(getPrakritiDataByIdAsync({ id, page: prakritiPage + 1 }));
  };

  const handlePrakritiPrevious = () => {
    dispatch(getPrakritiDataByIdAsync({ id, page: prakritiPage - 1 }));
  };

  useEffect(() => {
    if (id) {
      dispatch(getPrakritiDataByIdAsync({ id, page: currentPage }));
    }
    // eslint-disable-next-line
  }, [id]);
  return (
    <Container sx={{ pt: 2 }}>
      {isLoadingPrakriti ? (
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
        <Grid container spacing={3}>
          <Card sx={{ p: 3, width: '100%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            {totalPrakritiPage === 0 ? (
              <Typography
                variant="h3"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                No Test Data
              </Typography>
            ) : (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* {prakritiPage > 1 && ( */}
                  <Button
                    variant="contained"
                    onClick={handlePrakritiPrevious}
                    sx={{ marginRight: 'auto' }}
                    disabled={prakritiPage === 1}
                  >
                    <Iconify icon="ic:round-arrow-back-ios" width={15} /> Latest
                  </Button>
                  {/* )} */}

                  {/* {prakritiPage < totalPrakritiPage && ( */}
                  <Button
                    variant="contained"
                    onClick={handlePrakritiNext}
                    sx={{ marginLeft: 'auto' }}
                    disabled={prakritiPage === totalPrakritiPage}
                  >
                    Previous <Iconify icon="ic:round-arrow-forward-ios" width={15} />
                  </Button>
                  {/* )} */}
                </Box>

                {prakritiById.map((row, index) => (
                  <Box key={index}>
                    <Box>
                      <Typography variant="h5" sx={{ padding: '10px 0px 20px 0px' }}>
                        Test Date: {moment(row.createdAt)?.format('DD/MM/YYYY') || 'N/A'}
                      </Typography>
                    </Box>
                    <Box
                      rowGap={3}
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                      }}
                    >
                      <Typography variant="body1">
                        Body Frame: {prakriti[0][row.bodyFrame - 1]}
                      </Typography>
                      <Typography variant="body1">
                        Body Weight: {prakriti[1][row.bodyWeight - 1]}
                      </Typography>
                      <Typography variant="body1">
                        Lifestyle: {prakriti[2][row.lifeStyle - 1]}
                      </Typography>
                      <Typography variant="body1">
                        Skin Type: {prakriti[4][row.skinType - 1]}
                      </Typography>
                      <Typography variant="body1">
                        Body Temperature: {prakriti[5][row.bodyTemprature - 1]}
                      </Typography>
                      <Typography variant="body1">
                        Appetite: {prakriti[6][row.appetite - 1]}
                      </Typography>
                      <Typography variant="body1">
                        Bowel Movements: {prakriti[7][row.bowelMovements - 1]}
                      </Typography>
                      <Typography variant="body1">Moods: {prakriti[9][row.moods - 1]}</Typography>
                      <Typography variant="body1">
                        Sleep Pattern: {prakriti[10][row.sleepPatterns - 1]}
                      </Typography>
                      <Typography variant="body1">Vata%: {row.vatapercentage}</Typography>
                      <Typography variant="body1">Pitta%: {row.pittapercentage}</Typography>
                      <Typography variant="body1">Kapha%: {row.kaphapercentage}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ paddingTop: '20px' }}>
                        Result: {row.result[0]} {row.result[1]} {row.result[2]}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ paddingTop: '20px', display: 'flex', gap: 2 }}>
                        Doctor&apos;s Result:
                        <DocResult currentResult={row?.doctorResult ? row?.doctorResult : ''} id={row?._id} />
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </>
            )}
          </Card>
        </Grid>
      )}
    </Container>
  );
}

DocResult.propTypes = {
  currentResult: PropTypes.string,
  id: PropTypes.string,
};

function DocResult({ currentResult, id }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((store) => store?.role);

  const DocResultSchema = Yup.object().shape({
    doctorResult: '',
  });

  const defaultValues = useMemo(
    () => ({
      doctorResult: currentResult || null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentResult]
  );

  const methods = useForm({
    resolver: yupResolver(DocResultSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    formState: { isSubmitting },
    handleSubmit,
  } = methods;

  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(updatePakritiByIdAsync({ id, data }));
      if (response?.payload?.success) {
        enqueueSnackbar('Doctor Result Submitted.', {
          variant: 'success',
        });
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <RHFTextField name="doctorResult" label="Result" size='small' />
        <LoadingButton type="submit" variant="contained" size="small" loading={isSubmitting}>
          Submit
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

