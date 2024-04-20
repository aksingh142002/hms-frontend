import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Avatar, Box, Divider, Typography, Stack, MenuItem } from '@mui/material';
import { postLogoutAsync } from '@redux/services';
import { useDispatch } from 'react-redux';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components
import { CustomAvatar } from '../../../components/custom-avatar';
import { useSnackbar } from '../../../components/snackbar';
import MenuPopover from '../../../components/menu-popover';
import { IconButtonAnimate } from '../../../components/animate';
// import { dispatch } from '@redux/store';

// ----------------------------------------------------------------------

const OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
  },
  {
    label: 'Profile',
    linkTo: '/',
  },
  {
    label: 'Settings',
    linkTo: '/',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, logout } = useAuthContext();

  const role = JSON.parse(localStorage.getItem('userData'))
  const { enqueueSnackbar } = useSnackbar();

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleLogout = async () => {
    console.log('first')
    try {
      console.log('second')
      // logout();
      const response = await dispatch(postLogoutAsync());
      console.log('response', response)
      if (response?.payload?.success) {
        navigate(PATH_AUTH.login, { replace: true });
        enqueueSnackbar(response?.payload?.message);
        // localStorage.clear();
        handleClosePopover();
      }
    } catch (error) {
      console.log('error')
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  const handleClickItem = (path) => {
    handleClosePopover();
    navigate(path);
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpenPopover}
        sx={{
          p: 0,
          ...(openPopover && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        {/* <CustomAvatar src={user?.photoURL} sx={{bgcolor:'gery'}} alt={user?.displayName} name={user?.displayName} /> */}
        <Avatar
            src={role?.image}
            alt=""
            width={45}
            height={45}
            style={{ borderRadius: '50%' }}
          />
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 200, p: 0 }}>
       
        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
