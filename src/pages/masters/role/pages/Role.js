import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import RoleForm from '../components/RoleForm';

export default function UserCreatePage() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();
  const { pathname = '', state } = useLocation();
  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Role : Edit | VHAI',
        heading: 'Edit Role',
        breadCrumb: 'Edit a Role',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Role : View | VHAI',
        heading: 'View Role',
        breadCrumb: 'View a Role',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Role : Create | VHAI',
      heading: 'New Role',
      breadCrumb: 'Create a new Role',
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
          heading={editView?.heading}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.main,
            },
            {
              name: 'Role',
              href: PATH_DASHBOARD.role.root,
            },
            { name: editView?.breadCrumb ?? '' },
          ]}
        />
        <RoleForm isEdit={editView?.isEdit} isView={editView?.isView} currentRole={editView?.isEdit || editView?.isView ?state : {}} />
      </Container>
    </>
  );
}
