import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { getScheduleByIdAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import { ScheduleForm } from '../components';

export default function ScheduleCreatePage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { scheduleById } = useSelector((state) => state?.schedule);
  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Schedule: Edit | VHAI',
        heading: 'Edit Schedule',
        user: 'Edit',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Schedule: View | VHAI',
        heading: 'View Schedule',
        user: 'View',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Schedule: Create | VHAI',
      heading: 'Create Schedule',
      user: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id]);

  useEffect(() => {
    if (id) dispatch(getScheduleByIdAsync({ id }));
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
              name: 'Schedule',
              href: PATH_DASHBOARD.schedule.list,
            },
            {
              name: editView?.user,
              href: PATH_DASHBOARD.schedule.list,
            },
          ]}
        />
        <ScheduleForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          currentSchedule={editView?.isEdit || editView?.isView ? scheduleById : {}}
        />
      </Container>
    </>
  );
}
