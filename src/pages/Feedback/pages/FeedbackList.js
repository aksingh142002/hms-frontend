import { Card, Container, Table, TableBody, TableContainer } from '@mui/material';
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
} from '@components/table';

import { getBookingListAsync, getFeedbackListAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import FeedbackTableRow from '../components/FeedbackTableRow';

const TABLE_HEAD = [
  { id: 'Sr. No', label: 'Sr. No', align: 'left' },
  { id: 'feedback', label: 'Feedback', align: 'left' },
  { id: 'screenshot', label: 'Screenshot', align: 'left' },
  // { id: '' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit) };

export default function FeedbackList() {
  const {
    dense,
    order,
    orderBy,
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

  const { isLoading, AllFeedback, totalCount } = useSelector((store) => store?.feedback);
  const { modulePermit } = useSelector((store) => store?.menupermission);

  
  const dispatch = useDispatch();

  const [query, setQuery] = useState(DEFAULT_QUERY);

  const denseHeight = dense ? 52 : 72;

  const isNotFound = (!AllFeedback.length && !!query?.name) || (!AllFeedback.length && !!query?.role);

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
    dispatch(getFeedbackListAsync(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, query]);


  return (
    <>
      <Helmet>
        <title> Feedback: List | VHAI </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Feedback List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Feedback', href: PATH_DASHBOARD.feedback.list },
            { name: 'List' },
          ]}
        />

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={AllFeedback?.length}
                  numSelected={selected.length}
                  // onSort={onSort}
                />

                <TableBody>
                  {isLoading ||
                    AllFeedback?.map((row, index) => (
                    <FeedbackTableRow
                      index={index}
                      query={query}
                      key={row._id}
                      row={row}
                      selected={selected.includes(row?._id)}
                      onSelectRow={() => onSelectRow(row?._id)}
                      // onDeleteRow={(closeModal) => handleDeleteRow(row, closeModal)}
                      // onEditRow={() => handleEditRow(row)}
                      // onViewRow={() => handleViewRow(row)}
                    />
                  ))}

                  <TableNoData isNotFound={AllFeedback?.length} isLoading={isLoading} />
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
    </>
  );
}
