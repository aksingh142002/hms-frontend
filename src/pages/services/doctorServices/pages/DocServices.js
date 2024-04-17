import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getServiceByIdAsync } from '@redux/services/service';
import { DocServicesForm } from '../components';

export default function ServicesCreatePage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { ServiceById } = useSelector((state) => state?.service);
  const { pathname = '', state } = useLocation();

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Doctor Services : Edit | VHAI',
        heading: 'Edit Doctor Services',
        user: 'Edit',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Doctor Services : View | VHAI',
        heading: 'View Doctor Services',
        user: 'View',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Doctor Services : Create | VHAI',
      heading: 'Create Doctor Services',
      user: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id]);

  useEffect(() => {
    if (id) dispatch(getServiceByIdAsync({ id }));
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
              name: 'Doctor Services',
              href: PATH_DASHBOARD.docservices.list,
            },
            {
              name: editView?.user,
              href: PATH_DASHBOARD.docservices.list,
            },
          ]}
        />
        <DocServicesForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          currentservice={editView?.isEdit || editView?.isView ? ServiceById : {}}
        />
      </Container>
    </>
  );
}
