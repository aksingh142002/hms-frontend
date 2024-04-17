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
import { getCouponListAsync, deleteCouponAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import { CouponTableRow } from '../components';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'action', label: 'Action', align: 'left' },
  { id: 'Sr. No', label: 'Sr. No', align: 'left' },
  { id: 'couponName', label: 'Coupon Name', align: 'left' },
  { id: 'couponType', label: 'Coupon Type', align: 'left' },
  { id: 'couponCode', label: 'Coupon Code', align: 'left' },
  { id: 'issueNo', label: 'No Of issue', align: 'left' },
  { id: 'availableCoupon', label: 'Available Coupon', align: 'left' },
  { id: 'couponAmtOrPer', label: 'Coupon Value', align: 'left' },
  { id: 'minOrderPrice', label: 'Min Order Price', align: 'left' },
  { id: 'expiryDate', label: 'Expiry Date', align: 'left' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit) };

export default function StaffList() {
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

  const { isLoading, couponData, totalCount } = useSelector((store) => store?.coupon);
  const { modulePermit } = useSelector((store) => store?.menupermission);

  const dispatch = useDispatch();
  const [openConfirm, setOpenConfirm] = useState(false);

  const [search, setSearch] = useState('');

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
  const handleDeleteRow = async (row, closeModal) => {
    // API call to delete row.
    const response = await dispatch(deleteCouponAsync(row?._id));

    if (response?.payload?.success) {
      if (couponData?.length === 1 && query?.page > 1) {
        setQuery((p) => {
          p.page -= 1;
          return { ...p };
        });
      } else {
        dispatch(getCouponListAsync(query));
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
    navigate(PATH_DASHBOARD.coupon.edit(row?._id), { state: row });
  };

  const handleViewRow = (row) => {
    navigate(PATH_DASHBOARD.coupon.view(row?._id), { state: row });
  };

  const handlePageChange = (event, newPage) => {
    setQuery((p) => {
      p.page = newPage + 1;
      return { ...p };
    });
  };

  useEffect(() => {
    dispatch(getCouponListAsync(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, query]);

  return (
    <>
      <Helmet>
        <title> Coupon: List | VHAI </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Coupon List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Coupon', href: PATH_DASHBOARD.coupon.list },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.coupon.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              disabled={!modulePermit.create}
            >
              New Coupon
            </Button>
          }
        />

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={couponData?.length}
                  numSelected={selected.length}
                // onSort={onSort}
                />

                <TableBody>
                  {isLoading ||
                    couponData.map((row, index) => (
                      <CouponTableRow
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

                  <TableNoData isNotFound={couponData?.length} isLoading={isLoading} />
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
