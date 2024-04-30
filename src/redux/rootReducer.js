import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import loginReducer from './slices/loginSlice';
import dashboardSlice from './slices/dashboardSlice';
import staffReducer from './slices/staffSlice';
import LeaveSlice from './slices/LeaveSlice';
import studentSlice from './slices/studentSlice';
import resetPasswordSlice from './slices/resetPasswordSlice';
import routeSlice from './slices/routeSlice';
import permissionSlice from './slices/permissionSlice';
import menuPermission from './slices/menuPermission';

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
