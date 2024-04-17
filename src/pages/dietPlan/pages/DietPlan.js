import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { DietPlanForm } from '../components';

export default function DietPlanCreatePage() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Diet Plan: Edit | VHAI',
        heading: 'Edit Diet Plan',
        user: 'Edit',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Diet Plan: View | VHAI',
        heading: 'View Diet Plan',
        user: 'View',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Diet Plan: Create | VHAI',
      heading: 'Create Diet Plan',
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
              name: 'Diet Plan',
              href: PATH_DASHBOARD.dietplan.list,
            },
            {
              name: editView?.user,
              href: PATH_DASHBOARD.dietplan.list,
            },
          ]}
        />
        <DietPlanForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          currentDietPlan={editView?.isEdit || editView?.isView ? state : {}}
        />
      </Container>
    </>
  );
}
