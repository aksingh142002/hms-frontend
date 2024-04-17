import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { UserReportForm } from '../components';

export default function UserReportCreatePage() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'User Report: Edit | VHAI',
        heading: 'Edit User Report',
        user: 'Edit',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'User Report: View | VHAI',
        heading: 'View User Report',
        user: 'View',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'User Report: Create | VHAI',
      heading: 'Create User Report',
      user: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id]);

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
              name: 'User Report',
              href: PATH_DASHBOARD.userreport.list,
            },
            {
              name: editView?.user,
              href: PATH_DASHBOARD.userreport.list,
            },
          ]}
        />
        <UserReportForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          currentUserReport={editView?.isEdit || editView?.isView ? state : {}}
        />
      </Container>
    </>
  );
}
