import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import BannerForm from '../components/BannerForm';

export default function BannerPage() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();
  const { pathname = '', state } = useLocation();
  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Banner : Edit | VHAI',
        heading: 'Edit Banner',
        breadCrumb: 'Edit a Banner',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Banner : View | VHAI',
        heading: 'View Banner',
        breadCrumb: 'View a Banner',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Banner : Create | VHAI',
      heading: 'New Banner',
      breadCrumb: 'Create a new Banner',
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
          heading={editView?.heading}
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.main,
            },
            {
              name: 'Banner',
              href: PATH_DASHBOARD.banner.root,
            },
            { name: editView?.breadCrumb ?? '' },
          ]}
        />
        <BannerForm isEdit={editView?.isEdit} isView={editView?.isView} currentBanner={editView?.isEdit || editView?.isView ?state : {}} />
      </Container>
    </>
  );
}
