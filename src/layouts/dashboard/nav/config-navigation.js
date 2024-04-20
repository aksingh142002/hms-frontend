// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  master: icon('master'),
  student: icon('ic_user'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  users: icon('users'),
  services: icon('public-health'),
  testimonial:icon('ic_testimonial'),
  resources:icon('ic_resources'),
  plan: icon('plan'),
  staff: icon('medical-doctor'),
  report:icon('report'),
  diet:icon('food-24-filled'),
  booking:icon('ic_booking')
};

const navConfig = [
  {
    // subheader: 'General',
    items: [
      {
        title: 'Dashboard',
        path: PATH_DASHBOARD.dashboard.root,
        icon: ICONS.dashboard,
        // icon: ICONS.dashboard,
      },
   
      // {
      //   title: 'Masters',
      //   path: PATH_DASHBOARD.masters.root,
      //   icon: ICONS.master,
      //   children: [
      //     {
      //       title: 'Role',
      //       path: PATH_DASHBOARD.role.root,
      //     },
      //     {
      //       title: 'Category',
      //       path: PATH_DASHBOARD.category.root,
      //     },
      //   ],
      // },
      {
        title: 'Staff',
        path: PATH_DASHBOARD.staff.root,
        icon: ICONS.staff,
      },
      {
        title: 'Student',
        path: PATH_DASHBOARD.student.root,
        icon: ICONS.student,
      },
      // {
      //   title: 'Service',
      //   path: PATH_DASHBOARD.services.root,
      //   icon: ICONS.services,
      //   children: [
      //     {
      //       title: 'Doctor Service',
      //       path: PATH_DASHBOARD.docservices.root,
      //     },
      //     {
      //       title: 'Blood Test Service',
      //       path: PATH_DASHBOARD.bloodservices.root,
      //     },
      //     {
      //       title: 'Nutrition Service',
      //       path: PATH_DASHBOARD.nutriservices.root,
      //     },
      //   ],
      // },
      // {
      //   title: 'Plan',
      //   path: PATH_DASHBOARD.package.root,
      //   icon: ICONS.plan,
      // },
      // {
      //   title: 'Reports',
      //   path: PATH_DASHBOARD.reports.root,
      //   icon: ICONS.report,
      //   children: [
      //     {
      //       title: 'User Report',
      //       path: PATH_DASHBOARD.userreport.root,
      //     },
      //     {
      //       title: 'Blood Report',
      //       path: PATH_DASHBOARD.bloodreport.root,
      //     },
      //   ],
      // },
      // {
      //   title: 'Diet Plan',
      //   path: PATH_DASHBOARD.dietplan.root,
      //   icon: ICONS.diet,
      // },
      // {
      //   title: 'Testimonial',
      //   path: PATH_DASHBOARD.testimonial.root,
      //   icon: ICONS.testimonial,
      // },
      // {
      //   title: 'Resources',
      //   path: PATH_DASHBOARD.resources.root,
      //   icon: ICONS.resources,
      // },
      // {
      //   title: 'Booking',
      //   path: PATH_DASHBOARD.booking.root,
      //   icon: ICONS.booking,
      //   children: [
      //     {
      //       title: 'Plan Booking',
      //       path: PATH_DASHBOARD.bookingplan.root,
      //     },
      //     {
      //       title: 'Services Booking',
      //       path: PATH_DASHBOARD.bookingservice.root,
      //     },
      //   ],
      // },
    ],
  },
];

export default navConfig;