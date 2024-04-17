import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import AssignNutritionistForm from '../components/AssignNutritionistForm';

export default function Category() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  const editView = useMemo(() => {
    
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Plan: Assign Nutritionist | VHAI',
        heading: 'Assign Nutritionist',
        user: state?.name ?? '',
        isView: true,
      };
    }
    return {
      title: 'Plan: Assign Nutritionist | VHAI',
      heading: 'Assign Nutritionist',
      user: 'New',
      isView: false,
    };
  }, [pathname, id, state]);

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
              href: PATH_DASHBOARD.bookingplan.list,
            },
            {
              name: 'Assign Nutritionist',
            },
            {
              name: editView?.user,
            },
          ]}
        />
        <AssignNutritionistForm isView={editView?.isView} currentAssign={ state ?? {}}/>
      </Container>
    </>
  );
}
