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
import { deleteStudentAsync, getCourseListAsync, getStudentListAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import { StudentTableRow, StudentTableToolbar } from '../components';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'action', label: 'Action', align: 'left' },
  { id: 'Sr. No', label: 'Sr. No', align: 'left' },
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'universityRollNumber', label: 'University Roll No', align: 'left' },
  { id: 'Mobile', label: 'Mobile Number', align: 'left' },
  { id: 'batch', label: 'Batch', align: 'left' },
  { id: 'course', label: 'Course', align: 'left' },
  { id: 'Email', label: 'Email', align: 'left' },
];

const limit = localStorage.getItem('table-rows-per-page') ?? 10;
const DEFAULT_QUERY = { page: 1, limit: Number(limit) };

export default function StudentList() {
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

  const { isLoading, studentData, totalCount } = useSelector((store) => store?.student);
  const { modulePermit } = useSelector((store) => store?.menupermission);
  // const { allCourseData } = useSelector((store) => store?.Course);
  
  const allCourseData = ['BTech', 'BBA', 'BSC', 'MTech', 'MBA', 'MSC', 'Diploma'];
  const dispatch = useDispatch();
  const [openConfirm, setOpenConfirm] = useState(false);

  const [search, setSearch] = useState('');
  const [course, setCourse] = useState(null);

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
    if (search || course) {
      const updatedQuery = { ...query, page: 1, search, course };
      setQuery(updatedQuery);
    }
  };
  const handleResetFilter = () => {
    if (search || course) {
      setSearch('');
      const updatedQuery = { ...query, page: 1, search: '', course: '' };
      setQuery(updatedQuery);
    }
  };
  const handleDeleteRow = async (row, closeModal) => {
    const response = await dispatch(deleteStudentAsync(row?._id));

    if (response?.payload?.success) {
      if (studentData?.length === 1 && query?.page > 1) {
        setQuery((p) => {
          p.page -= 1;
          return { ...p };
        });
      } else {
        dispatch(getStudentListAsync(query));
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
    navigate(PATH_DASHBOARD.student.edit(row?._id), { state: row });
  };

  const handleViewRow = (row) => {
    navigate(PATH_DASHBOARD.student.view(row?._id), { state: row });
  };

  const handlePageChange = (event, newPage) => {
    setQuery((p) => {
      p.page = newPage + 1;
      return { ...p };
    });
  };
  // useEffect(() => {
  //   dispatch(getCourseListAsync());
  // }, [dispatch]);
  useEffect(() => {
    dispatch(getStudentListAsync(query));
  }, [dispatch, query]);

  return (
    <>
      <Helmet>
        <title> Student: List | OPJU Hostel </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Student List"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Student', href: PATH_DASHBOARD.student.list },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              to={PATH_DASHBOARD.student.new}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              // disabled={!modulePermit.create}
            >
              New Student
            </Button>
          }
        />

        <Card>
          <Divider />
          <StudentTableToolbar
            filterSearch={search}
            onFilterSearch={handleFilterSearch}
            courseData={allCourseData}
            course={course}
            onCourseChange={setCourse}
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
                  rowCount={studentData?.length}
                  numSelected={selected.length}
                />

                <TableBody>
                  {isLoading ||
                    studentData.map((row, index) => (
                      <StudentTableRow
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

                  <TableNoData isNotFound={studentData?.length} isLoading={isLoading} />
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
