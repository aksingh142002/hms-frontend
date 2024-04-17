import LoadingScreen from '@components/loading-screen';
import { Suspense, lazy } from 'react';

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// AUTH
export const LoginPage = Loadable(lazy(() => import('@pages/auth/pages/LoginPage')));
export const VerifyCodePage = Loadable(lazy(() => import('@pages/auth/pages/VerifyCodePage')));
export const NewPasswordPage = Loadable(lazy(() => import('@pages/auth/pages/NewPasswordPage')));
export const ResetPasswordPage = Loadable(
  lazy(() => import('@pages/auth/pages/ResetPasswordPage'))
);
// DASHBOARD
export const DashboardPage = Loadable(lazy(() => import('@pages/Dashboard/pages/DashboardPage')));
export const User = Loadable(lazy(() => import('@pages/users/pages/User')));
export const UserList = Loadable(lazy(() => import('@pages/users/pages/UserList')));
export const StaffList = Loadable(lazy(() => import('@pages/Staff/page/StaffList')));
export const Staff = Loadable(lazy(() => import('@pages/Staff/page/Staff')));
// export const PackageList = Loadable(lazy(() => import('@pages/Package/pages/PackageList')));
// export const Package = Loadable(lazy(() => import('@pages/Package/pages/Package')));
// export const RoleList = Loadable(lazy(() => import('@pages/masters/role/pages/RoleList')));
// export const Role = Loadable(lazy(() => import('@pages/masters/role/pages/Role')));
// export const PermissionsList = Loadable(
//   lazy(() => import('@pages/masters/permissions/pages/PermissionList'))
// );
// export const TestimonialList = Loadable(
//   lazy(() => import('@pages/Testimonial/pages/TestimonialList'))
// );
// export const Testimonial = Loadable(lazy(() => import('@pages/Testimonial/pages/Testimonial')));
// export const Resources = Loadable(lazy(() => import('@pages/Resources/pages/Resources')));
// export const ResourcesList = Loadable(lazy(() => import('@pages/Resources/pages/ResourcesList')));
// export const UserReportList = Loadable(
//   lazy(() => import('@pages/Reports/userReport/pages/UserReportList'))
// );
// export const UserReport = Loadable(
//   lazy(() => import('@pages/Reports/userReport/pages/UserReport'))
// );
// export const BloodReportList = Loadable(
//   lazy(() => import('@pages/Reports/bloodReport/pages/BloodReportList'))
// );
// export const BloodReport = Loadable(
//   lazy(() => import('@pages/Reports/bloodReport/pages/BloodReport'))
// );
// export const DietPlanList = Loadable(lazy(() => import('@pages/dietPlan/pages/DietPlanList')));
// export const DietPlan = Loadable(lazy(() => import('@pages/dietPlan/pages/DietPlan')));
// export const ServiceBooking = Loadable(lazy(() => import('@pages/Booking/Service/pages/Service')));
// export const ServiceBookingList = Loadable(
//   lazy(() => import('@pages/Booking/Service/pages/ServiceList'))
// );
// export const PlanBooking = Loadable(lazy(() => import('@pages/Booking/Plan/pages/Plan')));
// export const PlanBookingList = Loadable(lazy(() => import('@pages/Booking/Plan/pages/PlanList')));
// export const AssignDoctorPage = Loadable(
//   lazy(() => import('@pages/Booking/Assign/AssignDoctor/pages/AssignDoctor'))
// );
// export const AssignNutritionistPage = Loadable(
//   lazy(() => import('@pages/Booking/Assign/AssignNutritionist/pages/AssignNutritionist'))
// );
export const Page404 = Loadable(lazy(() => import('@pages/Page404')));
// export const DocServicesList = Loadable(
//   lazy(() => import('@pages/services/doctorServices/pages/DocServicesList'))
// );
// export const DocServices = Loadable(
//   lazy(() => import('@pages/services/doctorServices/pages/DocServices'))
// );
// export const BloodTestServicesList = Loadable(
//   lazy(() => import('@pages/services/bloodTestService.js/pages/BloodTestServicesList'))
// );
// export const BloodTestServices = Loadable(
//   lazy(() => import('@pages/services/bloodTestService.js/pages/BloodTestServices'))
// );
// export const NutritionServiceList = Loadable(
//   lazy(() => import('@pages/services/NutritionService/page/NutritionServiceList'))
// );
// export const NutritionServices = Loadable(
//   lazy(() => import('@pages/services/NutritionService/page/NutritionService'))
// );
// export const Category = Loadable(lazy(() => import('@pages/masters/Category/pages/Category')));
// export const CategoryList = Loadable(
//   lazy(() => import('@pages/masters/Category/pages/CategoryList'))
// );
// export const Banner = Loadable(lazy(() => import('@pages/masters/Banner/pages/Banner')));
// export const BannerList = Loadable(lazy(() => import('@pages/masters/Banner/pages/BannerList')));
// export const Coupon = Loadable(lazy(() => import('@pages/Coupon/pages/Coupon')));
// export const CouponList = Loadable(lazy(() => import('@pages/Coupon/pages/CouponList')));
// export const Schedule = Loadable(lazy(() => import('@pages/Schedule/pages/Schedule')));
// export const ScheduleList = Loadable(lazy(() => import('@pages/Schedule/pages/ScheduleList')));
// export const FeedbackList = Loadable(lazy(() => import('@pages/Feedback/pages/FeedbackList')));
// export const FaqPage = Loadable(lazy(() => import('@pages/masters/FAQ/pages/FaqPage')));
// export const FaqList = Loadable(lazy(() => import('@pages/masters/FAQ/pages/FaqList')));
// export const AppointmentList = Loadable(
//   lazy(() => import('@pages/Appointment/pages/AppointmentList'))
// );
// export const AppointmentCreatePage = Loadable(lazy(() => import('@pages/Appointment/pages/AppointmentCreatePage')));
// export const Appointment = Loadable(lazy(() => import('@pages/Appointment/pages/Appointment')));
// export const OtherDetails = Loadable(
//   lazy(() => import('@pages/Appointment/pages/AppointmentDetails'))
// );
