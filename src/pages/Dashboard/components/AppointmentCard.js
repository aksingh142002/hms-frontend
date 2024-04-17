import {
  Box,
  Button,
  Card,
  Container,
  Table,
  TableBody,
  TableContainer,
  Tab,
  Tabs,
  Divider,
  Typography,
} from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Iconify from '@components/iconify';
import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import Scrollbar from '@components/scrollbar';
import { useSettingsContext } from '@components/settings';
import { useSnackbar } from '@components/snackbar';
import { TableHeadCustom, TableNoData, TablePaginationCustom, useTable } from '@components/table';
import Label from '@components/label';
import { getBookingListAsync, getAppointmentListAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
// import AppointmentTableRow from '../../Appointment/components/AppointmentTableRow';

const TABLE_HEAD = [
  { id: 'Sr. No', label: 'Sr. No', align: 'left' },
  { id: 'userName', label: 'User Name', align: 'left' },
  { id: 'assignedDoc/Nut', label: 'Assigned Doctor / Nutritionist', align: 'left' },
  { id: 'role', label: 'Role', align: 'left' },
  { id: 'appointmentDate', label: 'Appointment Date', align: 'left' },
  { id: 'appointmentTime', label: 'Appointment Time', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'plan/serTitle', label: 'Plan / Service Title', align: 'left' },
  { id: 'symptom', label: 'Symptom', align: 'left' },
  { id: '' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit), tabFilter: 'Today' };

export default function AppointmentCard() {
  const {
    dense,
    order,
    orderBy,
    setPage,
    //
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

  const { isLoading, AllAppointment, totalCount } = useSelector((store) => store?.appointment);
  const { modulePermit } = useSelector((store) => store?.menupermission);

  const [filterStatus, setFilterStatus] = useState('Today');

  const dispatch = useDispatch();

  const TABS = [
    { value: 'Today', label: 'Today', color: 'success' },
    { value: 'Tomorrow', label: 'Tomorrow', color: 'warning' },
  ];
  const [query, setQuery] = useState(DEFAULT_QUERY);

  const denseHeight = dense ? 52 : 72;

  // const isNotFound = (!AllAppointment.length && !!query?.name) || (!AllAppointment.length && !!query?.role);

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
    const updatedQuery = { ...query, page: 1, tabFilter: newValue };
    setQuery(updatedQuery);
  };

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

  const handlePageChange = (event, newPage) => {
    setQuery((p) => {
      p.page = newPage + 1;
      return { ...p };
    });
  };
  const handleViewRow = (row) => {
    navigate(PATH_DASHBOARD.appointment.view(row?._id), { state: row });
  };

  useEffect(() => {
    dispatch(getAppointmentListAsync(query));
  }, [dispatch, query]);

  return (
    <Container sx={{ mt: 10 }} maxWidth={themeStretch ? false : 'lg'}>
      <Typography variant="h5">Appointment List</Typography>
      <Box sx={{ mb: 4 }}>
        <Tabs
          value={filterStatus}
          onChange={handleFilterStatus}
          sx={{
            px: 2,
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        <Divider />
      </Box>
      <Card>
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={AllAppointment?.length}
                numSelected={selected.length}
                // onSort={onSort}
              />

              <TableBody>
                {/* {isLoading ||
                  AllAppointment?.map((row, index) => (
                    <AppointmentTableRow
                      index={index}
                      query={query}
                      key={row._id}
                      row={row}
                      selected={selected.includes(row?._id)}
                      onSelectRow={() => onSelectRow(row?._id)}
                      onViewRow={() => handleViewRow(row)}
                      handleFilterStatus={()=> handleFilterStatus(null, filterStatus)}
                      filterStatus={filterStatus}
                    />
                  ))} */}
                <TableNoData isNotFound={AllAppointment?.length} isLoading={isLoading} />
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
  );
}
