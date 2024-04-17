import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { Helmet } from 'react-helmet-async';
import CreatePlan from '../components/CreatePlan';


export default function PlanList() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Plan: New | VHAI </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Plan Booking New"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Plan Booking', href: PATH_DASHBOARD.bookingplan.list },
            { name: 'New' },
          ]}
        />
        <CreatePlan />
      </Container>
    </>
  );
}
