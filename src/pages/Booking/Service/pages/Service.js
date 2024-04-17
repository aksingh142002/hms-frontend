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
  Link,
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
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import moment from 'moment/moment';
import Iconify from '@components/iconify';

export default function Service() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { pathname = '', state } = useLocation();
  const { isLoading, BookingById } = useSelector((store) => store?.booking);
  const {
    serviceId,
    paymentStatus,
    previousReports,
    paymentDate,
    orderId,
    billSummary,
    createdBy,
    assignedStaff,
  } = BookingById;
  const [preview, setPreview] = useState('');

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
        <title> Service Booking: Details | VHAI </title>
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
                            <TableCell> Service</TableCell>
                            <TableCell>Base Price(Rs.)</TableCell>

                            <TableCell>Discount Price(Rs.)</TableCell>

                            {/* <TableCell>Plan Duration(Months)</TableCell> */}
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ textTransform: 'capitalize' }}>
                              {assignedStaff?.name ?? 'Not assigned'}
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={serviceId?.title} src={serviceId?.thumbnailImage} />

                                <Typography
                                  variant="subtitle2"
                                  sx={{ textTransform: 'capitalize' }}
                                >
                                  {serviceId?.title}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>{serviceId?.basePrice}</TableCell>
                            <TableCell>{serviceId?.discountPrice}</TableCell>
                            {/* <TableCell>{serviceId?.duration}</TableCell> */}
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
                  <Stack>
                    <Stack direction="row" spacing={2} justifyContent="end">
                      <Typography>Base Price</Typography>
                      <Typography minWidth="95px" display="flex" justifyContent="end">
                        <Iconify icon="mdi:rupee" />
                        {serviceId?.basePrice ? serviceId?.basePrice : '0'}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} justifyContent="end">
                      <Typography>Discount Price</Typography>
                      <Typography color="green" minWidth="95px" display="flex" justifyContent="end">
                        <Iconify icon="mdi:rupee" />
                        {serviceId?.discountPrice ? serviceId?.discountPrice : '0'}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <Typography>Coupon Applied</Typography>
                      <Typography color="error" minWidth="95px" display="flex" justifyContent="end">
                        <Iconify icon="mdi:rupee" />
                        {serviceId?.couponCode ? serviceId?.couponCode : '0'}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} justifyContent="end">
                      <Typography>Total</Typography>
                      <Typography color="green" minWidth="95px" display="flex" justifyContent="end">
                        <Iconify icon="mdi:rupee" />
                        {billSummary?.payableAmt ? billSummary?.payableAmt : '0'}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item sm={12} md={4} lg={4} sx={{ display: 'flex', flexDirection: {sm: 'row', md: 'column'}}}>
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
              <Card sx={{ mt: 1, p: 3 }}>
                <Typography variant="h6" noWrap>Previous Reports</Typography>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {previousReports && previousReports.length > 0 ? (
                      <Typography>
                        {previousReports.map((pdf) => (
                          <Box key={pdf} sx={{ display: 'flex' }}>
                            <Typography>{pdf}</Typography>
                            <Link href={pdf}>
                              <Iconify icon="ic:round-cloud-download" />
                            </Link>
                          </Box>
                        ))}
                      </Typography>
                    ) : (
                      <Typography>No Report</Typography>
                    )}
                  </Box>
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
