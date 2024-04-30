import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { getStaffByIdAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import { StaffForm } from '../components';

export default function StaffCreatePage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { pathname = '', state } = useLocation();
  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Staff: Edit | OPJU Hostel',
        heading: 'Edit Staff',
        user: 'Edit',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Staff: View | OPJU Hostel',
        heading: 'View Staff',
        user: 'View',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Staff: Create | OPJU Hostel',
      heading: 'Create Staff',
      user: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id]);

  // useEffect(() => {
  //   if (id) dispatch(getStaffByIdAsync({ id }));
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
              name: 'Staff',
              href: PATH_DASHBOARD.staff.list,
            },
            {
              name: editView?.user,
              href: PATH_DASHBOARD.staff.list,
            },
          ]}
        />
        <StaffForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          currentStaff={editView?.isEdit || editView?.isView ? state : {}}
        />
      </Container>
    </>
  );
}
