import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Avatar,
  IconButton,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
// components
import ConfirmDialog from '@components/confirm-dialog';
import Iconify from '@components/iconify';
import Label from '@components/label';
import MenuPopover from '@components/menu-popover';
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import Tooltip from '@mui/material/Tooltip';
import moment from 'moment/moment';

// ----------------------------------------------------------------------

StaffTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  query: PropTypes.object,
  index: PropTypes.number,
  modulePermit: PropTypes.object,
};

export default function StaffTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  index,
  query,
  modulePermit,
}) {
  const { name, image, mobileNumber, email, role, lastLogin } = row;

  const { page, limit } = query;

  const { isDeleting } = useSelector((store) => store?.staff);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  console.log('lastLogin');

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2" noWrap ml={1}>
            {(page - 1) * limit + (index + 1)}
          </Typography>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={image} />

            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2">{mobileNumber}</Typography>
        </TableCell>

        <TableCell align="left">
          <Label variant="soft" sx={{ textTransform: 'none' }}>
            <Typography variant="subtitle2">{email}</Typography>
          </Label>
        </TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2">
            {lastLogin
              ? moment.utc(lastLogin).format('DD MMM YYYY hh:mm a')
              : 'N/A'}
          </Typography>
        </TableCell>

        <TableCell sx={{ textTransform: 'capitalize' }}>
          {role?.roleName.length > 16 ? (
            <Tooltip title={role?.roleName.replace(/\b\w/g, (char) => char.toUpperCase())} arrow>
              <Typography variant="subtitle2" noWrap sx={{ maxWidth: '200px' }}>
                {role?.roleName.substring(0, 16)}...
              </Typography>
            </Tooltip>
          ) : (
            <Typography variant="subtitle2">{role?.roleName}</Typography>
          )}
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="carbon:view-filled" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
          disabled={!modulePermit.edit}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
          disabled={!modulePermit.delete || role?.roleName.toLowerCase() === 'super admin'}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <LoadingButton
            loading={isDeleting}
            variant="contained"
            color="error"
            onClick={() => onDeleteRow(handleCloseConfirm)}
          >
            Delete
          </LoadingButton>
        }
      />
    </>
  );
}
