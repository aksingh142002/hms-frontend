import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container, Typography } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { getUserByIdAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import { UserView, PrakritiSection, AssessmentSection } from '../components';

export default function UserCreatePage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { userById } = useSelector((store) => store?.users);
  const { pathname = '', state } = useLocation();

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'User : Edit | OPJU Hostel',
        heading: 'Edit User',
        user: state?.name ?? '',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'User : View | OPJU Hostel',
        heading: 'View User',
        user: state?.name ?? '',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'User : View | OPJU Hostel',
      heading: 'View User',
      user: 'View',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id, state]);

  // useEffect(()=>{
  //   if(id) dispatch(getUserByIdAsync({id}))
  //    // eslint-disable-next-line
  // },[])

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
              name: 'User',
              href: PATH_DASHBOARD.user.list,
            },
            { name: state?.name },
          ]}
        />
        <Typography variant="h4" sx={{ padding: '10px 0 20px 0' }}>
          Basic Details
        </Typography>
        <UserView id={id} />

        <Typography variant="h4" sx={{ padding: '10px 0 20px 0' }}>
          Body Type
        </Typography>
        <PrakritiSection id={id} />
        <Typography variant="h4" sx={{ padding: '10px 0 20px 0' }}>
          Self Analysis
        </Typography>
        <AssessmentSection id={id} />
      </Container>
    </>
  );
}
