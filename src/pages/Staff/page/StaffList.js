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
import { deleteStaffAsync, getRoleListAsync, getStaffListAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import { StaffTableRow, StaffTableToolbar } from '../components';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'action', label: 'Action', align: 'left' },
  { id: 'Sr. No', label: 'Sr. No', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'Mobile', label: 'Mobile Number', align: 'left' },
  { id: 'Email', label: 'Email', align: 'left' },
  { id: 'lastLogin', label: 'Last Login', align: 'left' },

  { id: 'Role', label: 'Role', align: 'left' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit) };

export default function StaffList() {
  const {
    dense,
    order,
    orderBy,
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

  const { isLoading, staffData, totalCount } = useSelector((store) => store?.staff);
  const { modulePermit } = useSelector((store) => store?.menupermission);
  const { allRoleData } = useSelector((store) => store?.role);

  const dispatch = useDispatch();
  const [openConfirm, setOpenConfirm] = useState(false);

  const [search, setSearch] = useState('');
  const [role, setRole] = useState(null);

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
    if (search || role) {
      const updatedQuery = { ...query, page: 1, search, role: role?._id };
      setQuery(updatedQuery);
    }
  };
  const handleResetFilter = () => {
    if (search || role) {
      setSearch('');
      const updatedQuery = { ...query, page: 1, search: '', role: '' };
      setQuery(updatedQuery);
    }
  };
  const handleDeleteRow = async (row, closeModal) => {
    const response = await dispatch(deleteStaffAsync(row?._id));

    if (response?.payload?.success) {
      if (staffData?.length === 1 && query?.page > 1) {
        setQuery((p) => {
          p.page -= 1;
          return { ...p };
        });
      } else {
        dispatch(getStaffListAsync(query));
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
    navigate(PATH_DASHBOARD.staff.edit(row?._id), { state: row });
  };

  const handleViewRow = (row) => {
    navigate(PATH_DASHBOARD.staff.view(row?._id), { state: row });
  };

  const handlePageChange = (event, newPage) => {
    setQuery((p) => {
      p.page = newPage + 1;
      return { ...p };
    });
  };
  useEffect(() => {
    dispatch(getRoleListAsync());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getStaffListAsync(query));
  }, [dispatch, query]);

  return (
    <>
      <Helmet>
        <title> Staff: List | OPJU Hostel </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Staff List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Staff', href: PATH_DASHBOARD.staff.list },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.staff.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              disabled={!modulePermit.create}
            >
              New Staff
            </Button>
          }
        />

        <Card>
          <Divider />
          <StaffTableToolbar
            filterSearch={search}
            onFilterSearch={handleFilterSearch}
            roleData={allRoleData}
            role={role}
            onRoleChange={setRole}
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
                  rowCount={staffData?.length}
                  numSelected={selected.length}
                />

                <TableBody>
                  {isLoading ||
                    staffData.map((row, index) => (
                      <StaffTableRow
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

                  <TableNoData isNotFound={staffData?.length} isLoading={isLoading} />
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
