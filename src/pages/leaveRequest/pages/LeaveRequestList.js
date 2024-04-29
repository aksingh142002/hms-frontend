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
  deleteLeaveAsync,
  getLeaveListAsync,
  getStaffDocOrNutrAsync,
  getStaffListAsync,
} from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import { LeaveRequestTableRow, LeaveRequestTableToolbar } from '../components';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'action', label: 'Action', align: 'left' },
  { id: 'Sr. No', label: 'Sr. No', align: 'left' },
  { id: 'student', label: 'Student', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'startDate', label: 'Start Date', align: 'left' },
  { id: 'endDate', label: 'End Date', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'reason', label: 'Reason for Leave', align: 'left' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit) };

export default function LeaveRequestList() {
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

  const { isLoading, allLeaveData, totalCount } = useSelector((store) => store?.leave);
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
    const response = await dispatch(deleteLeaveAsync(row?._id));

    if (response?.payload?.success) {
      if (allLeaveData?.length === 1 && query?.page > 1) {
        setQuery((p) => {
          p.page -= 1;
          return { ...p };
        });
      } else {
        dispatch(getLeaveListAsync(query));
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
    navigate(PATH_DASHBOARD.leaveRequest.edit(row?._id), { state: row });
  };

  const handleViewRow = (row) => {
    navigate(PATH_DASHBOARD.leaveRequest.view(row?._id), { state: row });
  };

  const handlePageChange = (event, newPage) => {
    setQuery((p) => {
      p.page = newPage + 1;
      return { ...p };
    });
  };
  
  useEffect(() => {
    dispatch(getLeaveListAsync(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title> Leave Request: List | VHAI </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Leave Request List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Leave Requests', href: PATH_DASHBOARD.leaveRequest.list },
            { name: 'List' },
          ]}
          // action={
          //   <Button
          //     sx={{ color: 'white' }}
          //     component={RouterLink}
          //     to={PATH_DASHBOARD.leave.new}
          //     variant="contained"
          //     startIcon={<Iconify icon="eva:plus-fill" />}
          //     // disabled={!modulePermit.create}
          //   >
          //     New Leave
          //   </Button>
          // }
        />

        <Card>
          <Divider />
          <LeaveRequestTableToolbar
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
                  rowCount={allLeaveData?.length}
                  numSelected={selected.length}
                  // onSort={onSort}
                />

                <TableBody>
                  {isLoading ||
                    allLeaveData.map((row, index) => (
                      <LeaveRequestTableRow
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

                  <TableNoData isNotFound={allLeaveData?.length} isLoading={isLoading} />
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
