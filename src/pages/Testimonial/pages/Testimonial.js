import CustomBreadcrumbs from '@components/custom-breadcrumbs';
import { useSettingsContext } from '@components/settings';
import { Container } from '@mui/material';
import { PATH_DASHBOARD } from '@routes/paths';
import { useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router';
import { getTestimonialByIdAsync } from '@redux/services';
import { useDispatch, useSelector } from 'react-redux';
import { TestimonialForm } from '../components';

export default function Testimonial() {
  const dispatch = useDispatch();
  const { themeStretch } = useSettingsContext();
  const { testimonialById } = useSelector((state) => state?.testimonial);
  const { id } = useParams();
  const { pathname = '', state } = useLocation();

  const editView = useMemo(() => {
    if (id && /edit/i?.test(pathname)) {
      return {
        title: 'Testimonial: Edit | VHAI',
        heading: 'Edit Testimonial',
        user: 'Edit',
        isEdit: true,
        isView: false,
      };
    }
    if (id && /view/i?.test(pathname)) {
      return {
        title: 'Testimonial: View | VHAI',
        heading: 'View Testimonial',
        user: 'View',
        isEdit: false,
        isView: true,
      };
    }
    return {
      title: 'Testimonial: Create | VHAI',
      heading: 'Create Testimonial',
      user: 'New',
      isEdit: false,
      isView: false,
    };
  }, [pathname, id]);

  useEffect(() => {
    if (id) dispatch(getTestimonialByIdAsync({ id }));
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
              name: 'Testimonial',
              href: PATH_DASHBOARD.testimonial.list,
            },
            {
              name: editView?.user,
              href: PATH_DASHBOARD.testimonial.list,
            },
          ]}
        />
        <TestimonialForm
          isEdit={editView?.isEdit}
          isView={editView?.isView}
          currentTestimonial={editView?.isEdit || editView?.isView ? testimonialById : {}}
        />
      </Container>
    </>
  );
}
