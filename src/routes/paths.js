// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}
const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: '/login',
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  dashboard: {
    root: path(ROOTS_DASHBOARD, '/dashboard'),
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user/list'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/user/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/user/${id}/view`),
  },
  staff: {
    root: path(ROOTS_DASHBOARD, '/staff/list'),
    list: path(ROOTS_DASHBOARD, '/staff/list'),
    new: path(ROOTS_DASHBOARD, '/staff/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/staff/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/staff/${id}/view`),
  },
  // package: {
  //   root: path(ROOTS_DASHBOARD, '/package/list'),
  //   list: path(ROOTS_DASHBOARD, '/package/list'),
  //   new: path(ROOTS_DASHBOARD, '/package/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/package/${id}/edit`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/package/${id}/view`),
  // },
  // masters: {
  //   root: path(ROOTS_DASHBOARD, '/masters'),
  // },
  // banner: {
  //   root: path(ROOTS_DASHBOARD, '/masters/banner/list'),
  //   list: path(ROOTS_DASHBOARD, '/masters/banner/list'),
  //   new: path(ROOTS_DASHBOARD, '/masters/banner/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/masters/banner/${id}/edit`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/masters/banner/${id}/view`),
  // },
  // category: {
  //   root: path(ROOTS_DASHBOARD, '/masters/category/list'),
  //   list: path(ROOTS_DASHBOARD, '/masters/category/list'),
  //   new: path(ROOTS_DASHBOARD, '/masters/category/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/masters/category/${id}/edit`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/masters/category/${id}/view`),
  // },
  // faq: {
  //   root: path(ROOTS_DASHBOARD, '/masters/faq/list'),
  //   list: path(ROOTS_DASHBOARD, '/masters/faq/list'),
  //   new: path(ROOTS_DASHBOARD, '/masters/faq/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/masters/faq/${id}/edit`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/masters/faq/${id}/view`),
  // },

  // course: {
  //   root: path(ROOTS_DASHBOARD, '/masters/course/list'),
  //   list: path(ROOTS_DASHBOARD, '/masters/course/list'),
  //   new: path(ROOTS_DASHBOARD, '/masters/course/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/masters/course/${id}/edit`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/masters/course/${id}/view`),
  // },
  // role: {
  //   root: path(ROOTS_DASHBOARD, '/masters/role/list'),
  //   list: path(ROOTS_DASHBOARD, '/masters/role/list'),
  //   new: path(ROOTS_DASHBOARD, '/masters/role/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/masters/role/${id}/edit`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/masters/role/${id}/view`),
  //   Permissions: (id) => path(ROOTS_DASHBOARD, `/masters/role/${id}/Permissions`),
  // },
  // testimonial: {
  //   root: path(ROOTS_DASHBOARD, '/testimonial/list'),
  //   list: path(ROOTS_DASHBOARD, '/testimonial/list'),
  //   new: path(ROOTS_DASHBOARD, '/testimonial/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/testimonial/${id}/edit`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/testimonial/${id}/view`),
  // },
  // resources: {
  //   root: path(ROOTS_DASHBOARD, '/resources/list'),
  //   list: path(ROOTS_DASHBOARD, '/resources/list'),
  //   new: path(ROOTS_DASHBOARD, '/resources/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/resources/${id}/edit`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/resources/${id}/view`),
  // },


  // reports: {
  //   root: path(ROOTS_DASHBOARD, '/reports'),
  // },
  // userreport: {
  //   root: path(ROOTS_DASHBOARD, '/reports/userreport/list'),
  //   list: path(ROOTS_DASHBOARD, '/reports/userreport/list'),
  //   new: path(ROOTS_DASHBOARD, '/reports/userreport/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/reports/userreport/${id}/edit`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/reports/userreport/${id}/view`),
  // },
  // bloodreport: {
  //   root: path(ROOTS_DASHBOARD, '/reports/bloodreport/list'),
  //   list: path(ROOTS_DASHBOARD, '/reports/bloodreport/list'),
  //   new: path(ROOTS_DASHBOARD, '/reports/bloodreport/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/reports/bloodreport/${id}/edit`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/reports/bloodreport/${id}/view`),
  // },

  // dietplan: {
  //   root: path(ROOTS_DASHBOARD, '/dietplan/list'),
  //   list: path(ROOTS_DASHBOARD, '/dietplan/list'),
  //   new: path(ROOTS_DASHBOARD, '/dietplan/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/dietplan/${id}/edit`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/dietplan/${id}/view`),
  // },
  // booking: {
  //   root: path(ROOTS_DASHBOARD, '/booking'),
  // },
  // bookingplan: {
  //   root: path(ROOTS_DASHBOARD, '/booking/plan/list'),
  //   list: path(ROOTS_DASHBOARD, '/booking/plan/list'),
  //   new: path(ROOTS_DASHBOARD, '/booking/plan/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/booking/plan/${id}/edit`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/booking/plan/${id}/view`),
  //   Permissions: (id) => path(ROOTS_DASHBOARD, `/booking/plan/${id}/Permissions`),
  // },
  // assigndoctor:{
  //   new: (id) => path(ROOTS_DASHBOARD, `/booking/plan/assigndoctor/${id}/new`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/booking/plan/assigndoctor/${id}/view`),
  // },
  // assignnutritionist:{
  //   new: (id) => path(ROOTS_DASHBOARD, `/booking/plan/assignnutritionist/${id}/new`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/booking/plan/assignnutritionist/${id}/view`),
  // },
  // bookingservice: {
  //   root: path(ROOTS_DASHBOARD, '/booking/service/list'),
  //   list: path(ROOTS_DASHBOARD, '/booking/service/list'),
  //   new: path(ROOTS_DASHBOARD, '/booking/service/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/booking/service/${id}/edit`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/booking/service/${id}/view`),
  //   Permissions: (id) => path(ROOTS_DASHBOARD, `/booking/service/${id}/Permissions`),
  // },
  // services: {
  //   root: path(ROOTS_DASHBOARD, '/services'),
  // },
  // docservices: {
  //   root: path(ROOTS_DASHBOARD, '/services/doctorservice/list'),
  //   list: path(ROOTS_DASHBOARD, '/services/doctorservice/list'),
  //   new: path(ROOTS_DASHBOARD, '/services/doctorservice/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/services/doctorservice/${id}/edit`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/services/doctorservice/${id}/view`),
  // },
  // bloodservices: {
  //   root: path(ROOTS_DASHBOARD, '/services/bloodtest/list'),
  //   list: path(ROOTS_DASHBOARD, '/services/bloodtest/list'),
  //   new: path(ROOTS_DASHBOARD, '/services/bloodtest/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/services/bloodtest/${id}/edit`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/services/bloodtest/${id}/view`),
  // },
  // nutriservices: {
  //   root: path(ROOTS_DASHBOARD, '/services/nutritionservice/list'),
  //   list: path(ROOTS_DASHBOARD, '/services/nutritionservice/list'),
  //   new: path(ROOTS_DASHBOARD, '/services/nutritionservice/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/services/nutritionservice/${id}/edit`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/services/nutritionservice/${id}/view`),
  // },
  // coupon: {
  //   root: path(ROOTS_DASHBOARD, '/coupon/list'),
  //   list: path(ROOTS_DASHBOARD, '/coupon/list'),
  //   new: path(ROOTS_DASHBOARD, '/coupon/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/coupon/${id}/edit`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/coupon/${id}/view`),
  // },
  // schedule: {
  //   root: path(ROOTS_DASHBOARD, '/schedule/list'),
  //   list: path(ROOTS_DASHBOARD, '/schedule/list'),
  //   new: path(ROOTS_DASHBOARD, '/schedule/new'),
  //   edit: (id) => path(ROOTS_DASHBOARD, `/schedule/${id}/edit`),
  //   view: (id) => path(ROOTS_DASHBOARD, `/schedule/${id}/view`),
  // },
  // feedback: {
  //   root: path(ROOTS_DASHBOARD, '/feedback/list'),
  //   list: path(ROOTS_DASHBOARD, '/feedback/list'),
  // },
  // appointment:{
  //   root: path(ROOTS_DASHBOARD, '/myappointment/list'),
  //   list: path(ROOTS_DASHBOARD, '/myappointment/list'),
  //   new: path(ROOTS_DASHBOARD, '/myappointment/new'),
  //   view: (id) => path(ROOTS_DASHBOARD, `/myappointment/${id}/meet`),
  // },
  // otherdetails: {
  //   view: (id) => path(ROOTS_DASHBOARD, `/otherdetails/${id}/view`),
  // },
};
