import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
// import { getLeaveByIdAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import { LeaveForm } from '../components';

export default function LeaveCreatePage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { leaveById } = useSelector((state) => state?.leave);
  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Leave: Edit | VHAI',
        heading: 'Edit Leave',
        user: 'Edit',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Leave: View | VHAI',
        heading: 'View Leave',
        user: 'View',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Leave: Create | VHAI',
      heading: 'Create Leave',
      user: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id]);

  // useEffect(() => {
  //   if (id) dispatch(getLeaveByIdAsync({ id }));
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
              name: 'Leave',
              href: PATH_DASHBOARD.leave.list,
            },
            {
              name: editView?.user,
              href: PATH_DASHBOARD.leave.list,
            },
          ]}
        />
        <LeaveForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          currentLeave={editView?.isEdit || editView?.isView ? state : {}}
        />
      </Container>
    </>
  );
}
