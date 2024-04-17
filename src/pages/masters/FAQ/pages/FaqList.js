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
import { deleteFAQAsync, getFAQAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import { FaqTableRow, FaqTableToolbar } from '../components';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'action', label: 'Action', align: 'left' },
  { id: 'Sr. No', label: 'Sr. No', align: 'left' },
  { id: 'question', label: 'Question', align: 'left' },
  { id: 'question', label: 'Answer', align: 'left' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit) };

export default function FaqList() {
  const {
    dense,
    order,
    page,
    setPage,
    orderBy,
    selected,
    onSelectRow,
    onSort,
    rowsPerPage,
    onChangeDense,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const { isLoading, AllFAQ, totalCount } = useSelector((store) => store?.faq);

  const { modulePermit } = useSelector((store) => store?.menupermission);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [search, setSearch] = useState('');

  const dispatch = useDispatch();

  const [query, setQuery] = useState(DEFAULT_QUERY);

  const denseHeight = dense ? 52 : 72;

  // const isFiltered = filterName !== '' || filterCategory !== 'all' || filterStatus !== 'all';

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
    await dispatch(deleteFAQAsync(row?._id));
    // If API is success then only call below code.
    if (AllFAQ?.length === 1 && query?.page > 1) {
      setQuery((p) => {
        p.page -= 1;
        return { ...p };
      });
    } else {
      dispatch(getFAQAsync(query));
    }
    closeModal();
    enqueueSnackbar('Delete success!');
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
    navigate(PATH_DASHBOARD.faq.edit(row?._id), { state: row });
  };

  const handleViewRow = (row) => {
    navigate(PATH_DASHBOARD.faq.view(row?._id), { state: row });
  };

  const handlePageChange = (event, newPage) => {
    setQuery((p) => {
      p.page = newPage + 1;
      return { ...p };
    });
  };

  useEffect(() => {
    dispatch(getFAQAsync(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, query]);

  return (
    <>
      <Helmet>
        <title> FAQ: List | VHAI </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="FAQ List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'FAQ', href: PATH_DASHBOARD.faq.list },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.faq.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            // disabled={!modulePermit.create}
            >
              New FAQ
            </Button>
          }
        />

        <Card>
          {/* <Divider />
          <FaqTableToolbar
            filterSearch={search}
            onFilterSearch={handleFilterSearch}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
          /> */}
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={AllFAQ?.length}
                  numSelected={selected.length}
                // onSort={onSort}
                />

                <TableBody>
                  {isLoading ||
                    AllFAQ.map((row, index) => (
                      <FaqTableRow
                        key={row._id}
                        row={row}
                        index={index}
                        query={query}
                        selected={selected.includes(row?._id)}
                        onSelectRow={() => onSelectRow(row?._id)}
                        onDeleteRow={(closeModal) => handleDeleteRow(row, closeModal)}
                        onEditRow={() => handleEditRow(row)}
                        onViewRow={() => handleViewRow(row)}
                      // modulePermit={modulePermit}
                      />
                    ))}

                  <TableNoData isNotFound={AllFAQ?.length} isLoading={isLoading} />
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
