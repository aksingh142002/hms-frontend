import { Card, Container, Divider, Table, TableBody, TableContainer } from '@mui/material';
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
  getComparator,
  TableSkeleton,
} from '@components/table';

import { deleteUserAsync, getUsersAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useLocation } from 'react-router';
import { UserTableRow, UserTableToolbar } from '../components';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'action', label: 'Action', align: 'left' },
  { id: 'Sr. No', label: 'Sr. No', align: 'left' },
  { id: 'patientId', label: 'Patient Id', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'Phone', label: 'Phone', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'pinCode', label: 'Pincode', align: 'left' },
  { id: 'PlanTitle', label: 'Plan', align: 'center' },
  { id: 'expiryDate', label: 'Expiry Date', align: 'left' },
  { id: 'paymentStatus', label: 'Payment Status', align: 'left' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;

const statusData = ['Paid', 'Unpaid'];

export default function UserListPage() {
  const {
    dense,
    order,
    page,
    setPage,
    orderBy,
    selected,
    setSelected,
    onSelectRow,
    onSort,
    rowsPerPage,
    onChangeDense,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const location = useLocation();
  const DEFAULT_QUERY = { page: 1, limit: Number(limit), status: location?.state?.data ?? null };

  const { totalCount, users, isLoading } = useSelector((store) => store?.users);
  const { modulePermit } = useSelector((store) => store?.menupermission);

  const dispatch = useDispatch();

  const [query, setQuery] = useState(DEFAULT_QUERY);

  const denseHeight = dense ? 52 : 72;
  const [openConfirm, setOpenConfirm] = useState(false);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(location?.state?.data ?? null);

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
    if (search || status) {
      const updatedQuery = { ...query, page: 1, search, status };
      setQuery(updatedQuery);
    }
  };
  const handleResetFilter = () => {
    if (search || status) {
      setSearch('');
      const updatedQuery = { ...query, page: 1, search: '', status: null };
      setQuery(updatedQuery);
    }
  };

  const handleDeleteRow = async (row, closeModal) => {
    // API call to delete row.
    const response = await dispatch(deleteUserAsync(row?._id));
    if (response?.payload?.success) {
      if (users?.length === 1 && query?.page > 1) {
        setQuery((p) => {
          p.page -= 1;
          return { ...p };
        });
      } else {
        dispatch(getUsersAsync(query));
      }
      closeModal();
      enqueueSnackbar('Delete success!');
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
    navigate(PATH_DASHBOARD.user.edit(row?._id), { state: row });
  };

  const handleViewRow = (row) => {
    navigate(PATH_DASHBOARD.user.view(row?._id), { state: row });
  };

  const handlePageChange = (event, newPage) => {
    setQuery((p) => {
      p.page = newPage + 1;
      return { ...p };
    });
  };

  useEffect(() => {
    dispatch(getUsersAsync(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, query]);

  return (
    <>
      <Helmet>
        <title> User: List | OPJU Hostel </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="User List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.list },
            { name: 'List' },
          ]}
        />

        <Card>
          <Divider />
          <UserTableToolbar
            filterSearch={search}
            onFilterSearch={handleFilterSearch}
            statusData={statusData}
            status={status}
            onStatusChange={setStatus}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
          />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={users?.length}
                  numSelected={selected.length}
                  // onSort={onSort}
                />

                <TableBody>
                  {isLoading ||
                    users.map((row, index) => (
                      <UserTableRow
                        key={row._id}
                        index={index}
                        row={row}
                        query={query}
                        selected={selected.includes(row?._id)}
                        onSelectRow={() => onSelectRow(row?._id)}
                        onDeleteRow={(closeModal) => handleDeleteRow(row, closeModal)}
                        onEditRow={() => handleEditRow(row)}
                        onViewRow={() => handleViewRow(row)}
                        modulePermit={modulePermit}
                      />
                    ))}

                  <TableNoData isNotFound={users?.length} isLoading={isLoading} />
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
