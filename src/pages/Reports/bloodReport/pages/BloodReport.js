import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { getbloodReportByIdAsync } from '@redux/services';
import { BloodReportForm } from '../components';

export default function BloodReportCreatePage() {
  const dispatch = useDispatch();
  const { themeStretch } = useSettingsContext();
  
  
  const { id } = useParams();
  const { pathname = '', state } = useLocation(); 

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Blood Report: Edit | VHAI',
        heading: 'Edit Blood Report', 
        user: state?.name ?? '',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Blood Report: View | VHAI',
        heading: 'View Blood Report',
        user: state?.name ?? '',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Blood Report: Create | VHAI',
      heading: 'Create Blood Report',
      user: 'New',
      isEdit: false,
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
              name: 'Blood Report', 
              href: PATH_DASHBOARD.bloodreport.list, 
            },
            {
              name: 'New',
              href: PATH_DASHBOARD.bloodreport.list,
            },
          ]}
        />
        <BloodReportForm isEdit={editView?.isEdit} isView={editView?.isView} currentBloodReport={editView?.isEdit || editView?.isView ? state : {}}/>
      </Container>
    </>
  );
}
