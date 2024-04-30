import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// import productReducer from './slices/product';
// import usersReducer from './slices/users';
// import categorySlice from './slices/categorySlice';
import loginReducer from './slices/loginSlice';
import dashboardSlice from './slices/dashboardSlice';
// import symptomSlice from './slices/symptomSlice';
import staffReducer from './slices/staffSlice';
import LeaveSlice from './slices/LeaveSlice';
import studentSlice from './slices/studentSlice';
// import planReducer from './slices/planSlice';
// import testimonialSlice from './slices/testimonialSlice';
// import dietPlanReducer from './slices/dietPlanSlice';
// import resourcesSlice from './slices/resourcesSlice';
// import userReportSlice from './slices/userReportSlice';
// import bloodReportSlice from './slices/bloodReportSlice';
// import userProfileSlice from './slices/userProfileSlice';
import resetPasswordSlice from './slices/resetPasswordSlice';
// import bannerSlice from './slices/bannerSlice';
// import couponSlice from './slices/couponSlice';
// import scheduleSlice from './slices/scheduleSlice';
import routeSlice from './slices/routeSlice';
import permissionSlice from './slices/permissionSlice';
// import bookingSlice from './slices/bookingSlice';
import menuPermission from './slices/menuPermission';
// import feedbackSlice from './slices/feedbackSlice';
// import faqSlice from './slices/faqSlice';
// import appointmentSlice from './slices/appointmentSlice';
// import calorieSlice from './slices/calorieSlice';

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
  login: loginReducer,
  route: routeSlice,
  permission: permissionSlice,
  resetPass: resetPasswordSlice,
  dashboard: dashboardSlice,
  staff: staffReducer,
  leave: LeaveSlice,
  student: studentSlice,
});

export default rootReducer;
