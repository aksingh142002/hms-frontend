import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import productReducer from './slices/product';
import usersReducer from './slices/users';
import categorySlice from './slices/categorySlice';
import loginReducer from './slices/loginSlice';
import dashboardSlice from './slices/dashboardSlice';
import symptomSlice from './slices/symptomSlice';
import staffReducer from './slices/staffSlice';
import roleSlice from './slices/roleSlice';
import serviceSlice from './slices/serviceSlice';
import planReducer from './slices/planSlice';
import testimonialSlice from './slices/testimonialSlice';
import dietPlanReducer from './slices/dietPlanSlice';
import resourcesSlice from './slices/resourcesSlice';
import userReportSlice from './slices/userReportSlice';
import bloodReportSlice from './slices/bloodReportSlice';
import userProfileSlice from './slices/userProfileSlice';
import resetPasswordSlice from './slices/resetPasswordSlice';
import bannerSlice from './slices/bannerSlice';
import couponSlice from './slices/couponSlice';
import scheduleSlice from './slices/scheduleSlice';
import routeSlice from './slices/routeSlice';
import permissionSlice from './slices/permissionSlice';
import bookingSlice from './slices/bookingSlice';
import menuPermission from './slices/menuPermission';
import feedbackSlice from './slices/feedbackSlice';
import faqSlice from './slices/faqSlice';
import appointmentSlice from './slices/appointmentSlice';
import calorieSlice from './slices/calorieSlice';

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
  menupermission: menuPermission,
  users: usersReducer,
  login: loginReducer,
  route: routeSlice,
  permission: permissionSlice,
  resetPass: resetPasswordSlice,
  dashboard: dashboardSlice,
  symptom: symptomSlice,
  staff: staffReducer,
  userProfile: userProfileSlice,
  role: roleSlice,
  product: persistReducer(productPersistConfig, productReducer),
  category: categorySlice,
  service: serviceSlice,
  plan: planReducer,
  testimonial: testimonialSlice,
  dietPlan: dietPlanReducer,
  resources: resourcesSlice,
  userReport: userReportSlice,
  bloodReport: bloodReportSlice,
  banner: bannerSlice,
  faq: faqSlice,
  coupon: couponSlice,
  schedule: scheduleSlice,
  booking: bookingSlice,
  feedback: feedbackSlice,
  appointment: appointmentSlice,
  calorietracker: calorieSlice,
});

export default rootReducer;
