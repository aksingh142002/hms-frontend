import { Button, Card, Container, Divider, Table, TableBody, TableContainer } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import Iconify from '@components/iconify';
import Scrollbar from '@components/scrollbar';
import { useSettingsContext } from '@components/settings';
import { useSnackbar } from '@components/snackbar';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
  getComparator,
  TableSkeleton,
} from '@components/table';
import {
  deleteScheduleAsync,
  getScheduleListAsync,
  getStaffDocOrNutrAsync,
  getStaffListAsync,
} from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import { ScheduleTableRow, ScheduleTableToolbar } from '../components';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'action', label: 'Action', align: 'left' },
  { id: 'Sr. No', label: 'Sr. No', align: 'left' },
  { id: 'staff', label: 'Staff', align: 'left' },
  { id: 'role', label: 'Role', align: 'left' },
  { id: 'startDate', label: 'Start Date', align: 'left' },
  { id: 'endDate', label: 'End Date', align: 'left' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit) };

export default function ScheduleList() {
  const {
    dense,
    order,
    orderBy,
    //
    selected,
    onSelectRow,
    onSort,
    page,
    setPage,
    rowsPerPage,
    onChangeDense,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const { staffDocOrNut, staffData } = useSelector((store) => store?.staff);

  const { isLoading, scheduleData, totalCount } = useSelector((store) => store?.schedule);
  const { modulePermit } = useSelector((store) => store?.menupermission);

  const dispatch = useDispatch();
  const [openConfirm, setOpenConfirm] = useState(false);

  const [search, setSearch] = useState('');
  const [staff, setStaff] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [query, setQuery] = useState(DEFAULT_QUERY);

  const denseHeight = dense ? 52 : 72;
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setSearch(event.target.value);
  };

  const handleFilterSearch = () => {
    if (startDate || staff) {
      const updatedQuery = { ...query, page: 1, staffId: staff?._id, startDate, endDate };
      setQuery(updatedQuery);
    }
  };

  const handleResetFilter = () => {
    if (startDate || staff) {
      setSearch('');
      const updatedQuery = { ...query, page: 1, staffId: '', startDate: null, endDate: null };
      setQuery(updatedQuery);
    }
  };
  const handleDeleteRow = async (row, closeModal) => {
    // API call to delete row.
    const response = await dispatch(deleteScheduleAsync(row?._id));

    if (response?.payload?.success) {
      if (scheduleData?.length === 1 && query?.page > 1) {
        setQuery((p) => {
          p.page -= 1;
          return { ...p };
        });
      } else {
        dispatch(getScheduleListAsync(query));
      }
      closeModal();
      enqueueSnackbar(response?.payload?.message);
    }
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

  const handleEditRow = (row) => {
    navigate(PATH_DASHBOARD.schedule.edit(row?._id), { state: row });
  };

  const handleViewRow = (row) => {
    navigate(PATH_DASHBOARD.schedule.view(row?._id), { state: row });
  };

  const handlePageChange = (event, newPage) => {
    setQuery((p) => {
      p.page = newPage + 1;
      return { ...p };
    });
  };
  useEffect(() => {
    // dispatch(getStaffDocOrNutrAsync());
    dispatch(getStaffListAsync());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getScheduleListAsync(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, query]);

  return (
    <>
      <Helmet>
        <title> Schedule: List | VHAI </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Schedule List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Schedule', href: PATH_DASHBOARD.schedule.list },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.schedule.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              disabled={!modulePermit.create}
            >
              New Schedule
            </Button>
          }
        />

        <Card>
          <Divider />
          <ScheduleTableToolbar
            filterSearch={search}
            onFilterSearch={handleFilterSearch}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
            staffData={staffData?.filter(
              (item) => item?.role.roleName?.trim()?.toLowerCase() !== 'super admin'
            )}
            staff={staff}
            onStaffChange={setStaff}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
          />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={scheduleData?.length}
                  numSelected={selected.length}
                  // onSort={onSort}
                />

                <TableBody>
                  {isLoading ||
                    scheduleData.map((row, index) => (
                      <ScheduleTableRow
                        key={row._id}
                        row={row}
                        index={index}
                        query={query}
                        selected={selected.includes(row?._id)}
                        onSelectRow={() => onSelectRow(row?._id)}
                        onDeleteRow={(closeModal) => handleDeleteRow(row, closeModal)}
                        onEditRow={() => handleEditRow(row)}
                        onViewRow={() => handleViewRow(row)}
                        modulePermit={modulePermit}
                      />
                    ))}

                  <TableNoData isNotFound={scheduleData?.length} isLoading={isLoading} />
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
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>
    </>
  );
}
