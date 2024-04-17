import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { FaqForm } from '../components';

export default function FaqPage() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'FAQ: Edit | VHAI',
        heading: 'Edit FAQ',
        user: 'Edit',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'FAQ: View | VHAI',
        heading: 'View FAQ',
        user: 'View',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'FAQ: Create | VHAI',
      heading: 'Create FAQ',
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
              name: 'FAQ',
              href: PATH_DASHBOARD.faq.list,
            },
            {
              name: editView?.user,
              href: PATH_DASHBOARD.faq.list,
            },
          ]}
        />
        <FaqForm isEdit={editView?.isEdit} isView={editView?.isView} currentFAQ={state ?? {}} />
      </Container>
    </>
  );
}
