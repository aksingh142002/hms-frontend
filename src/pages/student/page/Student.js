import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { getStudentByIdAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import { StudentForm } from '../components';

export default function StudentCreatePage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { studentById } = useSelector((state) => state?.student);
  const { id } = useParams();
  const { pathname = '', state } = useLocation();
  console.log('state', state)
  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Student: Edit | OPJU Hostel',
        heading: 'Edit Student',
        user: 'Edit',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Student: View | OPJU Hostel',
        heading: 'View Student',
        user: 'View',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Student: Create | OPJU Hostel',
      heading: 'Create Student',
      user: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id]);

  // useEffect(() => {
  //   if (id) dispatch(getstudentByIdAsync({ id }));
  //   // eslint-disable-next-line
  // }, []);

  return (
    <>
      <Helmet>
        <title>{editView?.title ?? ''}</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={editView?.heading ?? ''}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Student',
              href: PATH_DASHBOARD.student.list,
            },
            {
              name: editView?.user,
              href: PATH_DASHBOARD.student.list,
            },
          ]}
        />
        <StudentForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          currentStudent={editView?.isEdit || editView?.isView ? state : {}}
        />
      </Container>
    </>
  );
}
