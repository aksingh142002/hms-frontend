import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { CategoryForm } from '../components';

export default function Category() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Category: Edit | VHAI',
        heading: 'Edit Category',
        user: 'Edit',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Category: View | VHAI',
        heading: 'View Category',
        user: 'View',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Category: Create | VHAI',
      heading: 'Create Category',
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
              name: 'Category',
              href: PATH_DASHBOARD.category.list,
            },
            {
              name: editView?.user,
              href: PATH_DASHBOARD.category.list,
            },
          ]}
        />
        <CategoryForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          currentCategory={state ?? {}}
        />
      </Container>
    </>
  );
}
