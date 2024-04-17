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
  emptyRows,
  TablePaginationCustom,
  useTable,
  getComparator,
  TableSkeleton,
} from '@components/table';
import { deleteServiceAsync, getServiceListAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import { BloodServicesTableRow, BloodServiceTableToolbar } from '../components';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'action', label: 'Action', align: 'left' },
  { id: 'Sr. No', label: 'Sr. No', align: 'left' },
  { id: 'Title', label: 'Title', align: 'left' },
  { id: 'No. of Test', label: 'No. of Test', align: 'left' },
  { id: 'Preparation', label: 'Preparation', align: 'left' },
  { id: 'Test Mode', label: 'Test Mode', align: 'left' },
  { id: 'Required Sample', label: 'Required Sample', align: 'left' },
  { id: 'Base Price', label: 'Base Price (Rs)', align: 'left' },
  { id: 'Discount Price', label: 'Discount Price (Rs)', align: 'left' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit), type: 'blood test' };

export default function ServicesListPage() {
  const {
    dense,
    order,
    orderBy,
    page,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    //
    onSort,
    onChangeDense,
    rowsPerPage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const { ServiceData, totalCount, isLoading } = useSelector((store) => store?.service);
  const { modulePermit } = useSelector((store) => store?.menupermission);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [search, setSearch] = useState('');

  const dispatch = useDispatch();

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
    const response = await dispatch(deleteServiceAsync(row?._id));
    // If API is success then only call below code.
    if (response?.payload?.success) {
      if (ServiceData?.length === 1 && query?.page > 1) {
        setQuery((p) => {
          p.page -= 1;
          return { ...p };
        });
      } else {
        dispatch(getServiceListAsync(query));
      }
      closeModal();
      enqueueSnackbar('Delete successfully!');
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
    navigate(PATH_DASHBOARD.bloodservices.edit(row?._id), { state: row });
  };

  const handleViewRow = (row) => {
    navigate(PATH_DASHBOARD.bloodservices.view(row?._id), { state: row });
  };

  const handlePageChange = (event, newPage) => {
    setQuery((p) => {
      p.page = newPage + 1;
      return { ...p };
    });
  };

  useEffect(() => {
    dispatch(getServiceListAsync(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, query]);

  return (
    <>
      <Helmet>
        <title> Blood Test Services : List | VHAI </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Blood Test Services List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Blood Test Services', href: PATH_DASHBOARD.bloodservices.list },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.bloodservices.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              disabled={!modulePermit.create}
            >
              New Blood Test Services
            </Button>
          }
        />

        <Card>
          <Divider />
          <BloodServiceTableToolbar
            filterSearch={search}
            onFilterSearch={handleFilterSearch}
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
                  rowCount={ServiceData?.length}
                  numSelected={selected.length}
                // onSort={onSort}
                />
                <TableBody>
                  {isLoading ||
                    ServiceData.map((row, index) => (
                      <BloodServicesTableRow
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

                  <TableNoData isNotFound={ServiceData?.length} isLoading={isLoading} />
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

function applyFilter({ inputData, comparator, filterName, filterStatus, filterRole }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter((user) =>
      user.title.toLowerCase().startsWith(filterName.toLowerCase())
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((user) => user.status === filterStatus);
  }

  if (filterRole !== 'all') {
    inputData = inputData.filter((user) => user.role === filterRole);
  }

  return inputData;
}