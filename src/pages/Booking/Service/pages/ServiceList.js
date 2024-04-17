import { Card, Container, Table, TableBody, TableContainer } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import Scrollbar from '@components/scrollbar';
import { useSettingsContext } from '@components/settings';
import { useSnackbar } from '@components/snackbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from '@components/table';

import { getBookingListAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import ServiceTableRow from '../components/ServiceTableRow';

const TABLE_HEAD = [
  { id: 'action', label: 'Action', align: 'left' },
  { id: 'Sr. No', label: 'Sr. No', align: 'left' },
  { id: 'userName', label: 'User Name', align: 'left' },
  { id: 'phone', label: 'Mobile Number', align: 'left' },
  { id: 'assignedDoc/Nut', label: 'Assigned Doctor / Nutritionist', align: 'left' },
  { id: 'appointmentDate', label: 'Appointment Date', align: 'left' },
  { id: 'startTime', label: 'Start Time', align: 'left' },
  { id: 'endTime', label: 'End Time', align: 'left' },
  { id: 'bookingDate', label: 'Booking Date', align: 'left' },
  { id: 'time', label: 'Purchase Time', align: 'left' },
  { id: 'OrderId', label: 'Order ID', align: 'left' },
  { id: 'amount', label: 'Amount', align: 'left' },
  { id: 'paymentStatus', label: 'Payment Status', align: 'left' },
  // { id: '' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit), type: 'Service' };

export default function ServiceList() {
  const {
    dense,
    order,
    orderBy,
    selected,
    setSelected,
    onSelectRow,
    //
    onSort,
    onChangeDense,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const { isLoading, AllBooking, totalCount } = useSelector((store) => store?.booking);
  const { modulePermit } = useSelector((store) => store?.menupermission);
  
  const dispatch = useDispatch();

  const [query, setQuery] = useState(DEFAULT_QUERY);

  const denseHeight = dense ? 52 : 72;

  const isNotFound = (!AllBooking.length && !!query?.name) || (!AllBooking.length && !!query?.role);

  const handleRowsPerPageChange = (event) => {
    const { value } = event.target;
    DEFAULT_QUERY.limit = parseInt(value, 10);
    onChangeRowsPerPage(event);
    setQuery((p) => {
      p.page = 1;
      p.limit = parseInt(value, 10);
      return { ...p };
    });
  };

  const handleEditRow = (row) => {
    navigate(PATH_DASHBOARD.bookingservice.edit(row?._id), { state: row });
  };

  const handleViewRow = (row) => {
    navigate(PATH_DASHBOARD.bookingservice.view(row?._id), { state: row });
  };

  const handlePageChange = (event, newPage) => {
    setQuery((p) => {
      p.page = newPage + 1;
      return { ...p };
    });
  };

  useEffect(() => {
    setSelected([]);
    dispatch(getBookingListAsync(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, query]);

  return (
    <>
      <Helmet>
        <title> Services: List | VHAI </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Services Booking List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Service Booking', href: PATH_DASHBOARD.bookingservice.list },
            { name: 'List' },
          ]}
        />

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={AllBooking?.length}
                  numSelected={selected.length}
                  // onSort={onSort}
                />

                <TableBody>
                  {isLoading ||
                    AllBooking?.map((row, index) => (
                    <ServiceTableRow
                      index={index}
                      query={query}
                      key={row._id}
                      row={row}
                      selected={selected.includes(row?._id)}
                      onSelectRow={() => onSelectRow(row?._id)}
                      // onDeleteRow={(closeModal) => handleDeleteRow(row, closeModal)}
                      // onEditRow={() => handleEditRow(row)}
                      onViewRow={() => handleViewRow(row)}
                      modulePermit={modulePermit}
                    />
                  ))}

                  <TableNoData isNotFound={AllBooking?.length} isLoading={isLoading} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={totalCount}
            page={query.page - 1}
            rowsPerPage={query?.limit}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>
    </>
  );
}
