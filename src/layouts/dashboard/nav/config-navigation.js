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
  student: icon('user'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('dashboard'),
  users: icon('user'),
  services: icon('public-health'),
  testimonial: icon('ic_testimonial'),
  resources: icon('ic_resources'),
  plan: icon('plan'),
  staff: icon('staff'),
  leave: icon('leave'),
  report: icon('report'),
  diet: icon('food-24-filled'),
  booking: icon('ic_booking'),
};

const user = JSON.parse(localStorage.getItem('userData'));

const navConfig = user?.role
  ? [
      {
        items: [
          {
            title: 'Dashboard',
            path: PATH_DASHBOARD.dashboard.root,
            icon: ICONS.dashboard,
          },
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
          {
            title: 'Leave Request',
            path: PATH_DASHBOARD.leaveRequest.root,
            icon: ICONS.leave,
          },
        ],
      },
    ]
  : [
      {
        items: [
          {
            title: 'Dashboard',
            path: PATH_DASHBOARD.dashboard.root,
            icon: ICONS.dashboard,
          },
          {
            title: 'Leave',
            path: PATH_DASHBOARD.leave.root,
            icon: ICONS.leave,
          },
          
        ],
      },
    ];

export default navConfig;
