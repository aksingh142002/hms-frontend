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
  // selected: PropTypes.bool,
  // onEditRow: PropTypes.func,
  // onViewRow: PropTypes.func,
  // onDeleteRow: PropTypes.func,
  // onSelectRow: PropTypes.func,
  query: PropTypes.object,
  index: PropTypes.number,
  // modulePermit: PropTypes.object,
};

export default function UserTableRow({
  row,
  index,
  query,
  // selected,
  // onEditRow,
  // onViewRow,
  // onSelectRow,
  // onDeleteRow,
  // modulePermit,
}) {
  const { isDeleting } = useSelector((store) => store?.users);

  const { planTitle, planDuration, patientName, patientNo, expiredplanDate, createdBy } = row;
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
      <TableRow>
        <TableCell>
          <Typography variant="subtitle2" noWrap ml={1}>
            {(page - 1) * limit + (index + 1)}
          </Typography>
        </TableCell>
        <TableCell>{createdBy ? <Typography>{createdBy?.name}</Typography> : 'N/A'}</TableCell>
        <TableCell>{createdBy ? <Typography>{createdBy?.mobile}</Typography> : 'N/A'}</TableCell>
        <TableCell>{planTitle}</TableCell>
        <TableCell>{planDuration}</TableCell>
        <TableCell align="left">{expiredplanDate ? moment(expiredplanDate)?.format('DD MMMM YYYY') : 'N/A'}</TableCell>

      </TableRow>

      {/* <MenuPopover
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

      {/* <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
          disabled={!modulePermit.delete}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem> */}
      {/* </MenuPopover>

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
      /> */}
    </>
  );
}
