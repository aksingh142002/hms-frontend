import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { paramCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import ConfirmDialog from '@components/confirm-dialog';
import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import Iconify from '@components/iconify';
import Scrollbar from '@components/scrollbar';
import { useSettingsContext } from '@components/settings';
import {
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  emptyRows,
  getComparator,
  useTable,
  TableSkeleton,
} from '@components/table';
import { deleteRoleAsync, getRoleListAsync } from '@redux/services';
import { RoleTableRow, RoleTableToolbar } from '../components';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'action', label: 'Action', align: 'left', width: '90px' },
  { id: 'Sr. No', label: 'Sr. No', align: 'left', width: '90px' },
  { id: 'role', label: 'Role', align: 'left' },
  { id: 'createdBy', label: 'Created By', align: 'left' },
];

// ----------------------------------------------------------------------

export default function CourseListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { isLoading, allRoleData, totalCount } = useSelector((store) => store?.role);
  const { modulePermit } = useSelector((store) => store?.menupermission);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [search, setSearch] = useState('');

  const limit = localStorage.getItem('table-rows-per-page') ?? 10;
  const DEFAULT_QUERY = { page: 1, limit: Number(limit) };

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
    if (search) {
      const updatedQuery = { ...query, page: 1, search };
      setQuery(updatedQuery);
    }
  };
  const handleResetFilter = () => {
    if (search) {
      setSearch('');
      const updatedQuery = { ...query, page: 1, search: '' };
      setQuery(updatedQuery);
    }
  };

  const handleDeleteRow = (row, closeModal) => {
    // API call to delete row.
    dispatch(deleteRoleAsync(row?._id)).then((response) => {
      if (response?.payload?.success) {
        if (allRoleData?.length === 1 && query?.page > 1) {
          setQuery((p) => {
            p.page -= 1;
            return { ...p };
          });
        } else {
          dispatch(getRoleListAsync(query));
        }
        closeModal();
        enqueueSnackbar(response?.payload?.message);
      }
    });
  };

  const handleEditRow = (row) => {
    navigate(PATH_DASHBOARD.role.edit(row?._id), { state: row });
  };

  const handleViewRow = (row) => {
    navigate(PATH_DASHBOARD.role.view(row?._id), { state: row });
  };

  const handlePermissionsRow = (row) => {
    navigate(PATH_DASHBOARD.role.Permissions(row?._id), { state: row });
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

  useEffect(() => {
    dispatch(getRoleListAsync(query));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, query]);
  return (
    <>
      <Helmet>
        <title> Role : List | VHAI </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Role  List"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Role List' }]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.role.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              disabled={!modulePermit?.create}
            >
              New Role
            </Button>
          }
        />

        <Card>
          <Divider />

          <RoleTableToolbar
            filterSearch={search}
            onFilterSearch={handleFilterSearch}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={allRoleData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  allRoleData.map((row) => row._id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={allRoleData.length}
                  numSelected={selected.length}
                  // onSort={onSort}
                />

                <TableBody>
                  {isLoading ||
                    allRoleData.map((row, index) => (
                      <RoleTableRow
                        query={query}
                        index={index}
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => onSelectRow(row._id)}
                        onDeleteRow={(closeModal) => handleDeleteRow(row, closeModal)}
                        onEditRow={() => handleEditRow(row)}
                        onViewRow={() => handleViewRow(row)}
                        onPermissionsRow={() => handlePermissionsRow(row)}
                        modulePermit={modulePermit}
                      />
                    ))}

                  <TableNoData isNotFound={allRoleData?.length} isLoading={isLoading} />
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

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              // handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------
