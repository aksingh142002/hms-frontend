import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Avatar, Box, Card, Container, Grid, CircularProgress, Typography } from '@mui/material';
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

UserView.propTypes = {
  id: PropTypes.string,
};

export default function UserView({ id }) {
  const dispatch = useDispatch();

  const { isLoading, profileById } = useSelector((store) => store?.userProfile);

  const {
    userId,
    image,
    age,
    dob,
    bmi,
    bodyType,
    foodPreferences,
    gender,
    height,
    initialWeight,
    targetWeight,
    anyMedications,
    anyAllergies,
    dietOption,
  } = profileById;

  useEffect(() => {
    if (id) {
      dispatch(getProfileByIdAsync({ id }));
    }
    // eslint-disable-next-line
  }, [id]);
  return (
    <>
      <Container sx={{ pt: 2 }}>
        {isLoading ? (
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
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(3, 1fr)',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  User: <Avatar alt={userId?.name || 'N/A'} src={userId?.image} />
                </Typography>
                <Typography variant="body1">Full Name: {userId?.name || 'N/A'}</Typography>
                <Typography variant="body1">Phone: {userId?.mobile || 'N/A'}</Typography>
                <Typography variant="body1">Email: {userId?.email || 'N/A'}</Typography>
                <Typography variant="body1">Pin Code: {userId?.pincode || 'N/A'}</Typography>
                <Typography variant="body1"> Gender : {gender || 'N/A'} </Typography>
                <Typography variant="body1"> Date Of Birth : {dob || 'N/A'} </Typography>
                <Typography variant="body1"> Age : {age || 'N/A'} Yrs</Typography>
                <Typography variant="body1">
                  Alernate mobile : {userId?.alternateMobile || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  Marital Status : {userId?.maritalStatus || 'N/A'}
                </Typography>
              </Box>
            </Card>
          </Grid>
        )}
      </Container>
      <Typography variant="h4" sx={{ padding: '10px 0 20px 0' }}>
        Health Profile
      </Typography>
      <Container sx={{ pt: 2 }}>
        {isLoading ? (
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
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(3, 1fr)',
                }}
              >
                {/* <Typography
                variant="body1"
                sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                User: <Avatar alt={userId?.name} src={userId?.image} />
              </Typography> */}
                <Typography variant="body1">
                  Food Preferences: {foodPreferences || 'N/A'}
                </Typography>
                <Typography variant="body1">Initial Weight : {initialWeight || 'N/A'} </Typography>
                <Typography variant="body1">Target Weight : {targetWeight || 'N/A'} </Typography>
                <Typography variant="body1"> Height : {height || 'N/A'} </Typography>
                <Typography variant="body1">BMI: {bmi || 'N/A'}</Typography>
                <Typography variant="body1">Body Type: {bodyType || 'N/A'}</Typography>
                <Typography variant="body1">Medications: {anyMedications || 'N/A'}</Typography>
                <Typography variant="body1">Allergies : {anyAllergies || 'N/A'} </Typography>
                <Typography variant="body1">Diet Option : {dietOption || 'N/A'}</Typography>
              </Box>
            </Card>
          </Grid>
        )}
      </Container>
    </>
  );
}
