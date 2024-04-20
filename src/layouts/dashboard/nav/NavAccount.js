// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Typography, Avatar } from '@mui/material';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components
import { CustomAvatar } from '../../../components/custom-avatar';


// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

export default function NavAccount() {
  const { user } = useAuthContext();
  const role = JSON.parse(localStorage.getItem('userData'))
  console.log('role', role)
  return (
    <StyledRoot>
      {/* <CustomAvatar src={user?.photoURL} alt={user?.displayName} name={user?.displayName} /> */}
      <Avatar
            src={role?.avatar}
            alt=""
            width={45}
            height={45}
            style={{ borderRadius: '50%' }}
          />

      <Box sx={{ ml: 2, minWidth: 0 }}>
        <Typography variant="subtitle2" noWrap>
          {/* {user?.displayName} */}
          {`${role?.firstName} ${role?.lastName}`}
        </Typography>

        <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
          {role?.role}
        </Typography>
      </Box>
    </StyledRoot>
  );
}
