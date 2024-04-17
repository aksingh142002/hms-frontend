import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { Helmet } from 'react-helmet-async';
import CreateServices from '../components/CreateServices';

export default function PlanList() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Services: New | VHAI </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Services Booking New"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Service Booking', href: PATH_DASHBOARD.bookingservice.list },
            { name: 'New' },
          ]}
        />
        <CreateServices />
      </Container>
    </>
  );
}
