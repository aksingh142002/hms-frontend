import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { getCouponByIdAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import { CouponForm } from '../components';

export default function CouponCreatePage() {
  const { themeStretch } = useSettingsContext();
  const dispatch = useDispatch();
  const { couponById } = useSelector((store) => store?.coupon);
  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Coupon: Edit | VHAI',
        heading: 'Edit Coupon',
        user: 'Edit',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Coupon: View | VHAI',
        heading: 'View Coupon',
        user: 'View',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Coupon: Create | VHAI',
      heading: 'Create Coupon',
      user: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id]);

  useEffect(() => {
    if (id) dispatch(getCouponByIdAsync({ id }));
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
              name: 'Coupon',
              href: PATH_DASHBOARD.coupon.list,
            },
            {
              name: editView?.user,
              href: PATH_DASHBOARD.coupon.list,
            },
          ]}
        />
        <CouponForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          currentCoupon={editView?.isEdit || editView?.isView ? couponById : {}}
        />
      </Container>
    </>
  );
}
