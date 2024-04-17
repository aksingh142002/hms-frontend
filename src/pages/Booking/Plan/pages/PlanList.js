import { Card, Container, Table, TableBody, TableContainer, Divider } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import Scrollbar from '@components/scrollbar';
import { useSettingsContext } from '@components/settings';
import { useSnackbar } from '@components/snackbar';
import { TableHeadCustom, TableNoData, TablePaginationCustom, useTable } from '@components/table';

import { getAllPlanListAsync, getBookingListAsync } from '@redux/services';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import PlanTableRow from '../components/PlanTableRow';
import PlanListToolbar from './PlanListToolbar';

const TABLE_HEAD = [
  { id: 'action', label: 'Action', align: 'left' },
  { id: 'Sr. No', label: 'Sr. No', align: 'left' },
  { id: 'userName', label: 'User Name', align: 'left' },
  { id: 'phone', label: 'Mobile Number', align: 'left' },
  { id: 'assignedDoc', label: 'Assigned Doctor', align: 'left' },
  { id: 'assignedNut', label: 'Assigned Nutritionist', align: 'left' },
  { id: 'planName', label: 'Plan', align: 'left' },
  { id: 'purchaseDate', label: 'Purchase Date', align: 'left' },
  { id: 'purchaseTime', label: 'Purchase Time', align: 'left' },
  { id: 'time', label: 'Expiry Date', align: 'left' },
  { id: 'OrderId', label: 'Order ID', align: 'left' },
  { id: 'amount', label: 'Amount', align: 'left' },
  { id: 'paymentStatus', label: 'Payment Status', align: 'left' },
  // { id: '' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit), type: 'Plan' };

export default function PlanList() {
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

  const navigate = useNavigate();

  const { isLoading, AllBooking, totalCount } = useSelector((store) => store?.booking);
  const { modulePermit } = useSelector((store) => store?.menupermission);

  const dispatch = useDispatch();

  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [search, setSearch] = useState('');

  const { planData } = useSelector((store) => store?.plan);
  const [plan, setPlan] = useState(null);

  const handleFilterSearch = () =>
  {
    if (plan) {
      const updatedQuery = { ...query, planId: plan };
      // dispatch(getBookingListAsync(updatedQuery));
      setQuery(updatedQuery);
    }
  };

  const handleFilterName = (event) => {
    setSearch(event.target.value);
  };

  const handleResetFilter = () => {
    if (plan) {
      setSearch('');
      const updatedQuery = { ...query, page: 1, planId: ''};
      setQuery(updatedQuery);
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

  const handleViewRow = (row) => {
    navigate(PATH_DASHBOARD.bookingplan.view(row?._id), { state: row });
  };
  const handleOtherViewRow = (row) => {
    navigate(PATH_DASHBOARD.otherdetails.view(row?._id), { state: { row, modulePermit } });
  };
  const handleAssignNutritionist = (row) => {
    navigate(PATH_DASHBOARD.assignnutritionist.new(row?._id), { state: row });
  };

  const handleAssignDoctor = (row) => {
    navigate(PATH_DASHBOARD.assigndoctor.new(row?._id), { state: row });
  };

  const handlePageChange = (event, newPage) => {
    setQuery((p) => {
      p.page = newPage + 1;
      return { ...p };
    });
  };

  useEffect(() => {
    setSelected([]);
    dispatch(getAllPlanListAsync());
    dispatch(getBookingListAsync(query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, query]);

  return (
    <>
      <Helmet>
        <title> Plan: List | VHAI </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Plan Booking List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Plan Booking', href: PATH_DASHBOARD.bookingplan.list },
            { name: 'List' },
          ]}
        />

        <Card>
          <Divider />
          <PlanListToolbar
            filterSearch={search}
            onFilterSearch={handleFilterSearch}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
            planData={planData}
            onPlanChange={setPlan}
          />
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={AllBooking?.length}
                  numSelected={selected.length}
                  // onSort={onSort}
                />

                <TableBody>
                  {isLoading ||
                    AllBooking?.map((row, index) => (
                      <PlanTableRow
                        index={index}
                        query={query}
                        key={row._id}
                        row={row}
                        selected={selected.includes(row?._id)}
                        onViewRow={() => handleViewRow(row)}
                        onOtherDetailsView={() => handleOtherViewRow(row)}
                        onAssignDoctor={() => handleAssignDoctor(row)}
                        onAssignNutritionist={() => handleAssignNutritionist(row)}
                        modulePermit={modulePermit}
                      />
                    ))}

                  <TableNoData isNotFound={AllBooking?.length} isLoading={isLoading} />
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
