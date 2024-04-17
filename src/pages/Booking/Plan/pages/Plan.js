import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import Label from '@components/label';
import { useSettingsContext } from '@components/settings';
import Scrollbar from '@components/scrollbar';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  Grid,
  Table,
  TableContainer,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Stack,
  CardContent,
  Divider,
} from '@mui/material';
import { getBookingByIdAsync } from '@redux/services';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import moment from 'moment/moment';
import Iconify from '@components/iconify';

export default function Plan() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const { pathname = '', state } = useLocation();
  const { isLoading, BookingById } = useSelector((store) => store?.booking);
  const { planId, paymentStatus, paymentDate, orderId, billSummary, createdBy, assignedStaff } =
    BookingById;
  useEffect(() => {
    dispatch(getBookingByIdAsync({ id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Helmet>
        <title> Plan Booking: Details | VHAI </title>
      </Helmet>
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
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Typography variant="h4" display="flex" alignItems="center" gap={2}>
            {orderId}
            <Label variant="soft" color="success">
              {paymentStatus}
            </Label>
          </Typography>
          <Typography sx={{ color: 'grey', mt: 1 }}>
            {paymentDate ? moment.utc(paymentDate).format('LLL') : ''}
          </Typography>
          <Grid container spacing={2}>
            <Grid item sm={12} md={8} lg={8}>
              <Card sx={{ mt: 1, p: 3 }}>
                <Typography variant="h6">Details</Typography>
                <CardContent>
                  <TableContainer sx={{ position: 'relative', overflow: 'unset', mb: 2 }}>
                    <Scrollbar>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Staff Assigned</TableCell>
                            <TableCell> Plan</TableCell>
                            <TableCell>Base Price(Rs.)</TableCell>

                            <TableCell>Discount Price(Rs.)</TableCell>

                            <TableCell>Plan Duration(Months)</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ textTransform: 'capitalize' }}>{assignedStaff?.name ?? 'Not assigned'}</TableCell>
                            <TableCell>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={planId?.title} src={planId?.thumbnailImage} />

                                <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                                  {planId?.title}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>{planId?.basePrice}</TableCell>
                            <TableCell>{planId?.discountPrice}</TableCell>
                            <TableCell>{planId?.duration}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Scrollbar>
                  </TableContainer>
                </CardContent>
                <Divider />
                <CardContent
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
                >
                  <Stack direction="row" spacing={2}>
                    <Typography>Base Price</Typography>
                    <Typography minWidth="95px" display="flex" justifyContent="end">
                      <Iconify icon="mdi:rupee" />
                      {planId?.basePrice ? planId?.basePrice : '0'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Typography>Discount Price</Typography>
                    <Typography color="green" minWidth="95px" display="flex" justifyContent="end">
                      <Iconify icon="mdi:rupee" />
                      {planId?.discountPrice ? planId?.discountPrice : '0'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Typography>Coupon Applied</Typography>
                    <Typography color="error" minWidth="95px" display="flex" justifyContent="end">
                      <Iconify icon="mdi:rupee" />
                      {planId?.couponCode ? planId?.couponCode : '0'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Typography>Total</Typography>
                    <Typography color="green" minWidth="95px" display="flex" justifyContent="end">
                      <Iconify icon="mdi:rupee" />
                      {billSummary?.payableAmt ? billSummary?.payableAmt : '0'}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item sm={6} md={4} lg={4}>
              <Card sx={{ mt: 1, p: 3 }}>
                <Typography variant="h6">User Details</Typography>
                <CardContent>
                  <Typography>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar alt={createdBy?.name} src={createdBy?.image} />

                      <Typography variant="subtitle2" noWrap sx={{ textTransform: 'capitalize' }}>
                        {createdBy?.name}
                      </Typography>
                    </Stack>
                  </Typography>
                </CardContent>
                <Divider />
                <CardContent>
                  <Typography>Mobile Number: {createdBy?.mobile}</Typography>
                  <Typography>Email: {createdBy?.email}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton onClick={handleBack} type="button" variant="contained">
            Back
          </LoadingButton>
        </Stack>
        </Container>
      )}
    </>
  );
}
