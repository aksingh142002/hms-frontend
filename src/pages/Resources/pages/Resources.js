import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { getResourcesByIdAsync } from '@redux/services/resourcesService';
import { useDispatch, useSelector } from 'react-redux';
import ResourcesForm from '../components/ResourcesForm';

export default function Resources() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { resourcesById } = useSelector((state) => state?.resources);
  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Resources: Edit | VHAI',
        heading: 'Edit Resources',
        user: 'Edit',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Resources: View | VHAI',
        heading: 'View Resources',
        user: 'View',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Resources: Create | VHAI',
      heading: 'Create Resources',
      user: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id]);

  useEffect(() => {
    if (id) dispatch(getResourcesByIdAsync({ id }));
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
              name: 'Resources',
              href: PATH_DASHBOARD.resources.list,
            },
            {
              name: editView?.user,
              href: PATH_DASHBOARD.resources.list,
            },
          ]}
        />
        <ResourcesForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          currentResources={editView?.isEdit || editView?.isView ? resourcesById : {}}
        />
      </Container>
    </>
  );
}
