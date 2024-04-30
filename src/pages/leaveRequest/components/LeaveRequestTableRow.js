import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Avatar,
  Dialog,
  DialogTitle,
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
import moment from 'moment/moment';
import ApproveRejectForm from './ApproveRejectForm';

// ----------------------------------------------------------------------

LeaveRequestTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  query: PropTypes.object,
  index: PropTypes.number,
  // modulePermit: PropTypes.object,
};

export default function LeaveRequestTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  index,
  query,
  // modulePermit,
}) {
  const { studentId, status, startDate, endDate, reason } = row;

  const { page, limit } = query;

  const { isDeleting } = useSelector((store) => store?.leave);

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
  const [openEdit, setOpenEdit] = useState(false);
  const [statusChange, setStatusChange] = useState('pending');
  const handleOpenEdit = (data) => {
    setOpenEdit(true);
    setStatusChange(data);
    handleClosePopover();
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
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
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={studentId?.firstName} src={studentId?.avatar} />

            <Typography variant="subtitle2" noWrap>
              {`${studentId?.firstName} ${studentId?.lastName}`}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2">{studentId?.email}</Typography>
        </TableCell>

        <TableCell align="left">
          <Typography variant="subtitle2">
            {moment(startDate)?.format('DD MMMM YYYY') || 'N/A'}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Typography variant="subtitle2">
            {moment(endDate)?.format('DD MMMM YYYY') || 'N/A'}
          </Typography>
        </TableCell>
        <TableCell align="left">
          <Label
            variant="soft"
            color={
              (status === 'rejected' && 'error') || (status === 'pending' && 'warning') || 'success'
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {status}
          </Label>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2">{reason}</Typography>
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

        <MenuItem onClick={() => handleOpenEdit('approved')} disabled={status !== 'pending'}>
          <Iconify icon="material-symbols-light:order-approve-outline" />
          Approve
        </MenuItem>
        <MenuItem onClick={() => handleOpenEdit('rejected')} disabled={status !== 'pending'}>
          <Iconify icon="material-symbols-light:do-not-step-outline" />
          Reject
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClosePopover();
          }}
          disabled={status !== 'pending'}
        >
          <Iconify icon="mdi:share-outline" />
          Share
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
          // disabled={!modulePermit.delete}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>
      <Dialog open={openEdit} onClose={handleCloseEdit}>
        <DialogTitle>{statusChange === 'approved' ? 'Approve' : 'Reject'}</DialogTitle>
        <ApproveRejectForm id={row?._id} status={statusChange} handleCloseEdit={handleCloseEdit} />
      </Dialog>
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
