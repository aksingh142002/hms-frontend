import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { getServiceByIdAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import { BloodServicesForm } from '../components';

export default function ServicesCreatePage() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { id } = useParams();

  const { pathname = '', state } = useLocation();

  const { ServiceById } = useSelector((store) => store?.service);

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Blood Test Services : Edit | VHAI',
        heading: 'Edit Blood Test Services',
        user: 'Edit',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Blood Test Services : View | VHAI',
        heading: 'View Blood Test Services',
        user: 'View',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Blood Test Services : Create | VHAI',
      heading: 'Create Blood Test Services',
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
              name: 'Blood Test Services',
              href: PATH_DASHBOARD.bloodservices.list,
            },
            {
              name: editView?.user,
              href: PATH_DASHBOARD.bloodservices.list,
            },
          ]}
        />
        <BloodServicesForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          currentBlood={editView?.isEdit || editView?.isView ? ServiceById : {}}
        />
      </Container>
    </>
  );
}
