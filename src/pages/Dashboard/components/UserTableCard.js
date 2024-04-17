import {
  Card,
  Container,
  Divider,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material';
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

import { deleteUserAsync, getPlanExpiryAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router';
import UserTableRow from './UserTableRow';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'Sr. No', label: 'Sr. No', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'phone', label: 'Phone', align: 'left' },
  { id: 'plan', label: 'Plan', align: 'left' },
  { id: 'duration', label: 'Plan Duration (Month)', align: 'left' },
  { id: 'expiryPlan', label: 'Expiry Date', align: 'left' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit) };

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

  const { totalCount, PlanExpiry, isLoading } = useSelector((store) => store?.booking);
  const { modulePermit } = useSelector((store) => store?.menupermission);
 
  const dispatch = useDispatch();

  const [query, setQuery] = useState(DEFAULT_QUERY);

  const denseHeight = dense ? 52 : 72;
  const [openConfirm, setOpenConfirm] = useState(false);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
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
    dispatch(getPlanExpiryAsync(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, query]);
 
  return (
    <>
      <Container sx={{ mt: 4 }} maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h5">Upcoming 10 Days User&apos;s Plan Expiry</Typography>
        <Card sx={{ mt: 2 }}>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={PlanExpiry?.length}
                  numSelected={selected.length}
                  // onSort={onSort}
                />

                <TableBody>
                {isLoading ||
                  PlanExpiry?.map((row, index) => (
                    <UserTableRow
                      key={row._id}
                      index={index}
                      row={row}
                      query={query}
                      selected={selected.includes(row?._id)}
                      //   onSelectRow={() => onSelectRow(row?._id)}
                      //   onDeleteRow={(closeModal) => handleDeleteRow(row, closeModal)}
                      //   onEditRow={() => handleEditRow(row)}
                      //   onViewRow={() => handleViewRow(row)}
                      //   modulePermit={modulePermit}
                    />
                  ))}

                  <TableNoData isNotFound={PlanExpiry?.length} isLoading={isLoading} />
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
