import { Navigate, useRoutes } from 'react-router-dom';

// import { AuthMiddleware } from '@layouts/middleware/AuthMiddleware';
// import { NavigateMiddleware } from '@layouts/middleware/NavigationMiddleware';
// import { RoutePermissionMiddleware } from '@layouts/middleware/RoutePermissionMiddleware';
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';

import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
import { PATH_AFTER_LOGIN } from '../config-global';

import {
  LoginPage,
  ResetPasswordPage,
  NewPasswordPage,
  VerifyCodePage,
  Page404,
  Student,
  StudentList,
  DashboardPage,
  StaffList,
  Staff,
  LeaveList,
  Leave,
  DocServicesList,
  DocServices,
  RoleList,
  Role,
  PermissionsList,
  Testimonial,
  TestimonialList,
  ResourcesList,
  Resources,
  UserReport,
  UserReportList,
  BloodReport,
  BloodReportList,
  DietPlan,
  DietPlanList,
  PlanBookingList,
  PlanBooking,
  AssignDoctorPage,
  AssignNutritionistPage,
  ServiceBookingList,
  ServiceBooking,
  BloodTestServicesList,
  BloodTestServices,
  NutritionServices,
  NutritionServiceList,
  CategoryList,
  Category,
  Banner,
  BannerList,
  FaqPage,
  FaqList,
  Coupon,
  CouponList,
  Schedule,
  ScheduleList,
  FeedbackList,
  AppointmentList,
  AppointmentCreatePage,
  AppointmentDetails,
  OtherDetails,
  Appointment,
  // CalorieTrackerPage,
  // PlanFeedbackPage,
  // DailyRoutinePage,
} from './elements';

export default function Router() {
  return useRoutes([
    {
      path: '/',
      children: [
        { element: <Navigate to="/login" replace />, index: true },
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: '/auth',
      children: [
        {
          element: <CompactLayout />,
          children: [
            { path: 'reset-password', element: <ResetPasswordPage /> },
            { path: 'new-password', element: <NewPasswordPage /> },
            { path: 'verify', element: <VerifyCodePage /> },
          ],
        },
      ],
    },
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          {/* <AuthMiddleware> */}
            {/* <NavigateMiddleware>
              <RoutePermissionMiddleware> */}
                <DashboardLayout />
              {/* </RoutePermissionMiddleware>
            </NavigateMiddleware> */}
          {/* </AuthMiddleware> */}
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'dashboard',
          element: <DashboardPage />,
        },
        {
          path: 'student',
          children: [
            { element: <Navigate to="/dashboard/student/list" replace />, index: true },
            { path: 'list', element: <StudentList /> },
            { path: 'new', element: <Student /> },
            { path: ':id/edit', element: <Student /> },
            { path: ':id/view', element: <Student /> },
          ],
        },
        {
          path: 'staff',
          children: [
            { element: <Navigate to="/dashboard/staff/list" replace />, index: true },
            { path: 'list', element: <StaffList /> },
            { path: 'new', element: <Staff /> },
            { path: ':id/edit', element: <Staff /> },
            { path: ':id/view', element: <Staff /> },
          ],
        },
        {
          path: 'leave',
          children: [
            { element: <Navigate to="/dashboard/leave/list" replace />, index: true },
            { path: 'list', element: <LeaveList /> },
            { path: 'new', element: <Leave /> },
            { path: ':id/edit', element: <Leave /> },
            { path: ':id/view', element: <Leave /> },
          ],
        },
    //     {
    //       path: 'schedule',
    //       children: [
    //         { element: <Navigate to="/dashboard/schedule/list" replace />, index: true },
    //         { path: 'list', element: <ScheduleList /> },
    //         { path: 'new', element: <Schedule /> },
    //         { path: ':id/edit', element: <Schedule /> },
    //         { path: ':id/view', element: <Schedule /> },
    //       ],
    //     },
    //     {
    //       path: 'masters',
    //       children: [
    //         {
    //           path: 'role',
    //           children: [
    //             {
    //               element: <Navigate to="/dashboard/masters/role/list" replace />,
    //               index: true,
    //             },
    //             { path: 'list', element: <RoleList /> },
    //             { path: 'new', element: <Role /> },
    //             { path: ':id/edit', element: <Role /> },
    //             { path: ':id/view', element: <Role /> },

    //             { path: ':id/permissions', element: <PermissionsList /> },
    //           ],
    //         },
    //         {
    //           path: 'category',
    //           children: [
    //             {
    //               element: <Navigate to="/dashboard/masters/category/list" replace />,
    //               index: true,
    //             },
    //             { path: 'list', element: <CategoryList /> },
    //             { path: 'new', element: <Category /> },
    //             { path: ':id/edit', element: <Category /> },
    //             { path: ':id/view', element: <Category /> },

    //             // { path: ':id/permissions', element: <PermissionsList /> },
    //           ],
    //         },
    //         {
    //           path: 'banner',
    //           children: [
    //             {
    //               element: <Navigate to="/dashboard/masters/banner/list" replace />,
    //               index: true,
    //             },
    //             { path: 'list', element: <BannerList /> },
    //             { path: 'new', element: <Banner /> },
    //             { path: ':id/edit', element: <Banner /> },
    //             { path: ':id/view', element: <Banner /> },

    //             // { path: ':id/permissions', element: <PermissionsList /> },
    //           ],
    //         },
    //         {
    //           path: 'faq',
    //           children: [
    //             {
    //               element: <Navigate to="/dashboard/masters/faq/list" replace />,
    //               index: true,
    //             },
    //             { path: 'list', element: <FaqList /> },
    //             { path: 'new', element: <FaqPage /> },
    //             { path: ':id/edit', element: <FaqPage /> },
    //             { path: ':id/view', element: <FaqPage /> },

    //             // { path: ':id/permissions', element: <PermissionsList /> },
    //           ],
    //         },
    //       ],
    //     },

    //     {
    //       path: 'services',
    //       children: [
    //         {
    //           path: 'doctorservice',
    //           children: [
    //             {
    //               element: <Navigate to="/dashboard/services/doctorservice/list" replace />,
    //               index: true,
    //             },
    //             { path: 'list', element: <DocServicesList /> },
    //             { path: 'new', element: <DocServices /> },
    //             { path: ':id/edit', element: <DocServices /> },
    //             { path: ':id/view', element: <DocServices /> },
    //           ],
    //         },
    //         {
    //           path: 'bloodtest',
    //           children: [
    //             {
    //               element: <Navigate to="/dashboard/services/bloodtest/list" replace />,
    //               index: true,
    //             },
    //             { path: 'list', element: <BloodTestServicesList /> },
    //             { path: 'new', element: <BloodTestServices /> },
    //             { path: ':id/edit', element: <BloodTestServices /> },
    //             { path: ':id/view', element: <BloodTestServices /> },
    //           ],
    //         },
    //         {
    //           path: 'nutritionservice',
    //           children: [
    //             {
    //               element: <Navigate to="/dashboard/services/nutritionservice/list" replace />,
    //               index: true,
    //             },
    //             { path: 'list', element: <NutritionServiceList /> },
    //             { path: 'new', element: <NutritionServices /> },
    //             { path: ':id/edit', element: <NutritionServices /> },
    //             { path: ':id/view', element: <NutritionServices /> },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       path: 'testimonial',
    //       children: [
    //         { element: <Navigate to="/dashboard/testimonial/list" replace />, index: true },
    //         { path: 'list', element: <TestimonialList /> },
    //         { path: 'new', element: <Testimonial /> },
    //         { path: ':id/edit', element: <Testimonial /> },
    //         { path: ':id/view', element: <Testimonial /> },
    //       ],
    //     },
    //     {
    //       path: 'resources',
    //       children: [
    //         { element: <Navigate to="/dashboard/resources/list" replace />, index: true },
    //         { path: 'list', element: <ResourcesList /> },
    //         { path: 'new', element: <Resources /> },
    //         { path: ':id/edit', element: <Resources /> },
    //         { path: ':id/view', element: <Resources /> },
    //       ],
    //     },

    //     {
    //       path: 'reports',
    //       children: [
    //         {
    //           path: 'userreport',
    //           children: [
    //             {
    //               element: <Navigate to="/dashboard/reports/userreport/list" replace />,
    //               index: true,
    //             },
    //             { path: 'list', element: <UserReportList /> },
    //             { path: 'new', element: <UserReport /> },
    //             { path: ':id/edit', element: <UserReport /> },
    //             { path: ':id/view', element: <UserReport /> },
    //           ],
    //         },
    //         {
    //           path: 'bloodreport',
    //           children: [
    //             {
    //               element: <Navigate to="/dashboard/reports/bloodreport/list" replace />,
    //               index: true,
    //             },
    //             { path: 'list', element: <BloodReportList /> },
    //             { path: 'new', element: <BloodReport /> },
    //             { path: ':id/edit', element: <BloodReport /> },
    //             { path: ':id/view', element: <BloodReport /> },
    //           ],
    //         },
    //       ],
    //     },

    //     {
    //       path: 'dietplan',
    //       children: [
    //         { element: <Navigate to="/dashboard/dietplan/list" replace />, index: true },
    //         { path: 'list', element: <DietPlanList /> },
    //         { path: 'new', element: <DietPlan /> },
    //         { path: ':id/edit', element: <DietPlan /> },
    //         { path: ':id/view', element: <DietPlan /> },
    //       ],
    //     },
    //     {
    //       path: 'coupon',
    //       children: [
    //         { element: <Navigate to="/dashboard/coupon/list" replace />, index: true },
    //         { path: 'list', element: <CouponList /> },
    //         { path: 'new', element: <Coupon /> },
    //         { path: ':id/edit', element: <Coupon /> },
    //         { path: ':id/view', element: <Coupon /> },
    //       ],
    //     },
    //     {
    //       path: 'booking',
    //       children: [
    //         {
    //           path: 'plan',
    //           children: [
    //             {
    //               element: <Navigate to="/dashboard/booking/plan/list" replace />,
    //               index: true,
    //             },
    //             { path: 'list', element: <PlanBookingList /> },
    //             { path: 'new', element: <PlanBooking /> },
    //             { path: ':id/edit', element: <PlanBooking /> },
    //             { path: ':id/view', element: <PlanBooking /> },
    //             {
    //               path: 'assigndoctor',
    //               children: [
    //                 { path: ':id/new', element: <AssignDoctorPage /> },
    //                 { path: ':id/view', element: <AssignDoctorPage /> },
    //               ],
    //             },
    //             {
    //               path: 'assignnutritionist',
    //               children: [
    //                 { path: ':id/new', element: <AssignNutritionistPage /> },
    //                 { path: ':id/view', element: <AssignNutritionistPage /> },
    //               ],
    //             },
    //             // { path: ':id/permissions', element: <PermissionsList /> },
    //           ],
    //         },
    //         {
    //           path: 'service',
    //           children: [
    //             {
    //               element: <Navigate to="/dashboard/booking/service/list" replace />,
    //               index: true,
    //             },
    //             { path: 'list', element: <ServiceBookingList /> },
    //             { path: 'new', element: <ServiceBooking /> },
    //             { path: ':id/edit', element: <ServiceBooking /> },
    //             { path: ':id/view', element: <ServiceBooking /> },

    //             // { path: ':id/permissions', element: <PermissionsList /> },
    //           ],
    //         },
    //       ],
    //     },
    //     {
    //       path: 'feedback',
    //       children: [
    //         { element: <Navigate to="/dashboard/feedback/list" replace />, index: true },
    //         { path: 'list', element: <FeedbackList /> },
    //       ],
    //     },
    //     {
    //       path: 'myappointment',
    //       children: [
    //         { element: <Navigate to="/dashboard/myappointment/list" replace />, index: true },
    //         { path: 'list', element: <AppointmentList /> },
    //         { path: 'new', element: <AppointmentCreatePage /> },
    //         { path: ':id/meet', element: <Appointment /> },
    //       ],
    //     },
    //     {
    //       path: 'otherdetails',
    //       children: [
    //         { element: <Navigate to="/dashboard/otherdetails" replace />, index: true },
    //         { path: ':id/view', element: <OtherDetails /> },
    //       ],
    //     },
      ],
    },
    {
      element: <CompactLayout />,
      children: [{ path: '404', element: <Page404 /> }],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
