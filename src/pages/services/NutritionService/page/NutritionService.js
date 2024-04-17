import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { getServiceByIdAsync } from '@redux/services/service';
import { useDispatch, useSelector } from 'react-redux';
import { NutritionForm } from '../components';

export default function NutritionServicePage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { ServiceById } = useSelector((state) => state?.service);

  const { pathname = '', state } = useLocation();

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Nutrition Services: Edit | VHAI',
        heading: 'Edit Nutrition Services',
        user: 'Edit',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Nutrition Services: View | VHAI',
        heading: 'View Nutrition Services',
        user: 'View',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Nutrition Services: Create | VHAI',
      heading: 'Create Nutrition Services',
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
              name: 'Nutrition Services',
              href: PATH_DASHBOARD.nutriservices.list,
            },
            {
              name: editView?.user,
              href: PATH_DASHBOARD.nutriservices.list,
            },
          ]}
        />
        <NutritionForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          currentService={editView?.isEdit || editView?.isView ? ServiceById : {}}
        />
      </Container>
    </>
  );
}
