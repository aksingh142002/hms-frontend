import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getPlanByIdAsync } from '@redux/services';
import { PackageForm } from '../components';

export default function PackageCreatePage() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { id } = useParams();

  const { pathname = '', state } = useLocation();

  const { planById } = useSelector((store) => store?.plan);

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Plan: Edit | VHAI',
        heading: 'Edit Plan',
        user: 'Edit',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Plan: View | VHAI',
        heading: 'View Plan',
        user: 'View',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Plan: Create | VHAI',
      heading: 'Create Plan',
      user: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id]);

  useEffect(() => {
    if (id) dispatch(getPlanByIdAsync({ id }));
    // eslint-disable-next-line
  }, []);

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
              name: 'Plan',
              href: PATH_DASHBOARD.package.list,
            },
            {
              name: editView?.user,
              href: PATH_DASHBOARD.package.list,
            },
            // { name: editView?.services },
          ]}
        />
        <PackageForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          currentPackage={editView?.isEdit || editView?.isView ? planById : {}}
        />
      </Container>
    </>
  );
}
