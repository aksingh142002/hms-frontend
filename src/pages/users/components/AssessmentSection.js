import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Box, Card, Container, Grid, CircularProgress, Typography } from '@mui/material';
import Iconify from '@components/iconify/Iconify';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProfileByIdAsync,
  getAssessmentByIdAsync,
  getPrakritiDataByIdAsync,
} from '@redux/services';
import moment from 'moment/moment';
import { prakriti, assessment } from '../data';

AssessmentSection.propTypes = {
  id: PropTypes.string,
};

export default function AssessmentSection({ id }) {
  const dispatch = useDispatch();
  const { isLoadingAssessment, assessmentById, assessmentPage, totalAssessmentPage } = useSelector(
    (store) => store?.userProfile
  );
  const analysisreview = (data) => {
    if (data >= 30) {
      // excellent
      return 'Excellent';
    }
    if (data >= 26 && data <= 29) {
      return 'Good';
    }
    if (data >= 18 && data <= 25) {
      return 'Average';
    }
    if (data >= 10 && data <= 17) {
      return 'Below Average';
    }
    if (data < 10) {
      return 'Poor';
    }
    return '';
  };

  const [currentPage, setCurrentPage] = useState(1);

  // Assessment Page Change
  const handleAssessmentNext = () => {
    dispatch(getAssessmentByIdAsync({ id, page: assessmentPage + 1 }));
  };

  const handleAssessmentPrevious = () => {
    dispatch(getAssessmentByIdAsync({ id, page: assessmentPage - 1 }));
  };

  useEffect(() => {
    if (id) {
      dispatch(getAssessmentByIdAsync({ id, page: currentPage }));
    }
    // eslint-disable-next-line
  }, [id]);
  return (
    <Container sx={{ pt: 2 }}>
      {isLoadingAssessment ? (
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
            {totalAssessmentPage === 0 ? (
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
                  {/* {assessmentPage > 1 && ( */}
                  <Button
                    variant="contained"
                    onClick={handleAssessmentPrevious}
                    sx={{ marginRight: 'auto' }}
                    disabled={assessmentPage === 1}
                  >
                    <Iconify icon="ic:round-arrow-back-ios" width={15} /> Latest
                  </Button>
                  {/* )} */}

                  {/* {assessmentPage < totalAssessmentPage && ( */}
                  <Button
                    variant="contained"
                    onClick={handleAssessmentNext}
                    sx={{ marginLeft: 'auto' }}
                    disabled={assessmentPage === totalAssessmentPage}
                  >
                    Previous <Iconify icon="ic:round-arrow-forward-ios" width={15} />
                  </Button>
                  {/* )} */}
                </Box>
                {assessmentById.map((row, index) => (
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
                        Diet Pattern and Quality: {assessment[0][row.dietPatternAndQuality - 1]}
                      </Typography>
                      <Typography variant="body1">
                        Physical Activity: {assessment[1][row.physicalAcivity - 1]}
                      </Typography>
                      <Typography variant="body1">
                        Stress Level: {assessment[2][row.stressLevel - 1]}
                      </Typography>
                      <Typography variant="body1">
                        Sleep Quality: {assessment[3][row.sleepQuality - 1]}
                      </Typography>
                      <Typography variant="body1">
                        Alcohol Consumption: {assessment[4][row.alcoholConsumption - 1]}
                      </Typography>
                      <Typography variant="body1">
                        Tobacco Use: {assessment[5][row.tobaccoUse - 1]}
                      </Typography>
                      <Typography variant="body1">
                        Any Existing Health Issues: {assessment[6][row.existingHealthIssue]}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ paddingTop: '20px' }}>
                        Total Marks: {row.totalMarks} {analysisreview(row.totalMarks)}
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
