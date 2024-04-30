import { Container, Grid } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import { useSettingsContext } from '@components/settings';
import { getDashboardAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import {  CustomCard } from '../components';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { dashboardData } = useSelector((store) => store?.dashboard);
  const { permissionMenu } = useSelector((store) => store?.menupermission);
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();

  const handleCardClick = (row) => {
    const { path, data } = row;
    const queryParameters = data ? { data } : {};
    navigate(path, { state: queryParameters });
  };

  // useEffect(() => {
  //   dispatch(getDashboardAsync());
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const staffPermission =
  //   permissionMenu[0].items?.filter((item) => item?.title === 'Staff')?.length !== 0;
  // const userPermission =
  //   permissionMenu[0].items?.filter((item) => item?.title === 'User')?.length !== 0;
  // const myAppointmentPermission =
  //   permissionMenu[0].items?.filter((item) => item?.title === 'My Appointment')?.length !== 0;

  return (
    <>
      <Helmet>
        <title> Dashboard | OPJU Hostel </title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Grid container spacing={3} mt={2}>
          {/* {userPermission && ( */}
            <Grid item xs={12} sm={6} md={3}>
              <CustomCard
                title="Total Hosteller"
                // total={dashboardData?.totalUsers}
                total='40'
                color="secondary"
                icon="fa6-solid:users"
                onClick={() => handleCardClick({ path: PATH_DASHBOARD.user.list })}
              />
            </Grid>
          {/* )}
          {staffPermission && ( */}
            <Grid item xs={12} sm={6} md={3}>
              <CustomCard
                title="Total Staff"
                // total={dashboardData?.totalStaff}
                total='5'
                color="error"
                icon="majesticons:user"
                onClick={() => handleCardClick({ path: PATH_DASHBOARD.staff.list })}
              />
            </Grid>
          {/* )}
          {myAppointmentPermission && ( */}
            <Grid item xs={12} sm={6} md={3}>
              <CustomCard
                title="Available Room"
                // total={dashboardData?.todaysApponitment}
                total='9'
                color="primary"
                icon="mdi:guest-room"
                onClick={() =>
                  handleCardClick({ path: PATH_DASHBOARD.appointment.list, data: 'Today' })
                }
              />
            </Grid>
          {/* )}
          {myAppointmentPermission && ( */}
            <Grid item xs={12} sm={6} md={3}>
              <CustomCard
                title="Total Rooms"
                // total={dashboardData?.tomorrowsAppointment}
                total={20}
                color="info"
                icon="mdi:guest-room"
                onClick={() =>
                  handleCardClick({ path: PATH_DASHBOARD.appointment.list, data: 'Tomorrow' })
                }
              />
            </Grid>
          {/* )}
          {userPermission && ( */}
          <Grid item xs={12} sm={6} md={3}>
              <CustomCard
                title="Pending Leave Approval"
                // total={dashboardData?.todaysApponitment}
                total='9'
                color="primary"
                icon="material-symbols-light:luggage"
                onClick={() =>
                  handleCardClick({ path: PATH_DASHBOARD.appointment.list, data: 'Today' })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomCard
                title="Leave Approved"
                // total={dashboardData?.totalActiveUsers}
                total={20}
                color="secondary"
                icon="material-symbols-light:luggage"
                onClick={() => handleCardClick({ path: PATH_DASHBOARD.user.list, data: 'Paid' })}
              />
            </Grid>
          {/* )}
          {myAppointmentPermission ? <AppointmentCard /> : null}
          {userPermission ? <UserTableCard /> : null} */}
        </Grid>
      </Container>
    </>
  );
}
