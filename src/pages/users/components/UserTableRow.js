import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Typography, IconButton, MenuItem, TableCell, TableRow } from '@mui/material';
// components
import ConfirmDialog from '@components/confirm-dialog';
import Iconify from '@components/iconify';
import Label from '@components/label';
import MenuPopover from '@components/menu-popover';
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import moment from 'moment/moment';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
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

export default function UserTableRow({
  row,
  index,
  query,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  modulePermit,
}) {
  const { isDeleting } = useSelector((store) => store?.users);

  const { name, mobile, pincode, email, expiredplanDate, paymentStatus, planTitle, patientId } =
    row;
  const { page, limit } = query;
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

        <TableCell sx={{ textTransform: 'capitalize' }}>
          {patientId ? (
            <Typography variant="subtitle2">{patientId}</Typography>
          ) : (
            <Typography variant="subtitle2">N/A</Typography>
          )}
        </TableCell>

        <TableCell sx={{ textTransform: 'capitalize' }}>
          {name ? (
            <Typography variant="subtitle2">{name}</Typography>
          ) : (
            <Typography variant="subtitle2">N/A</Typography>
          )}
        </TableCell>

        <TableCell>
          {mobile ? (
            <Typography variant="subtitle2">{mobile}</Typography>
          ) : (
            <Typography variant="subtitle2">N/A</Typography>
          )}
        </TableCell>
        <TableCell align="left">
          <Label variant="soft" sx={{ textTransform: 'none' }}>
            {email ? (
              <Typography variant="subtitle2">{email}</Typography>
            ) : (
              <Typography variant="subtitle2">N/A</Typography>
            )}
          </Label>
        </TableCell>
        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {pincode ? (
            <Typography variant="subtitle2">{pincode}</Typography>
          ) : (
            <Typography variant="subtitle2">N/A</Typography>
          )}
        </TableCell>
        <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
          {planTitle ? <Typography variant="subtitle2">{planTitle}</Typography> : 'N/A'}
        </TableCell>
        <TableCell align="left">
          <Typography variant="subtitle2">
            {expiredplanDate ? (
              moment(expiredplanDate)?.format('DD MMM YYYY')
            ) : (
              <Typography variant="subtitle2">N/A</Typography>
            )}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Label
            variant="soft"
            color={paymentStatus === 'paid' ? 'success' : 'warning'}
            sx={{ textTransform: 'capitalize' }}
          >
            <Typography variant="subtitle2">
              {' '}
              {paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
            </Typography>
          </Label>
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

        {/* <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem> */}

        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
          disabled={!modulePermit.delete}
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
