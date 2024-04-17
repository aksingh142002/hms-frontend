import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
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
import moment from 'moment/moment';
import ChangeDocForm from './ChangeDocForm';

// ----------------------------------------------------------------------

ServiceTableRow.propTypes = {
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

export default function ServiceTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  query,
  index,
  modulePermit,
}) {
  const {
    assignedStaff,
    patientName,
    patientNo,
    planId,
    serviceId,
    orderId,
    timeSlot,
    billSummary,
    paymentStatus,
    paymentDate,
    createdAt,
  } = row;
  const { page, limit } = query;
  // const { name: companyName } = company;

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
          <Typography variant="subtitle2">{patientName}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2">{patientNo}</Typography>
        </TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={assignedStaff ? 'success' : 'error'}
            sx={{ textTransform: 'capitalize' }}
          >
            <Typography variant="subtitle2">{assignedStaff?.name ?? 'Not assigned'}</Typography>
          </Label>
        </TableCell>
        <TableCell align="left">
          <Label variant="soft" sx={{ textTransform: 'capitalize' }}>
            <Typography variant="subtitle2">
              {timeSlot?.startTime ? moment.utc(timeSlot?.startTime).format('DD-MM-YYYY') : ''}
            </Typography>
          </Label>
        </TableCell>
        <TableCell align="left">
          <Label variant="soft" sx={{ textTransform: 'capitalize' }}>
            <Typography variant="subtitle2">
              {timeSlot?.startTime ? moment.utc(timeSlot?.startTime).format('HH:mm') : ''}
            </Typography>
          </Label>
        </TableCell>
        <TableCell align="left">
          <Label variant="soft" sx={{ textTransform: 'capitalize' }}>
            <Typography variant="subtitle2">
              {timeSlot?.endTime ? moment.utc(timeSlot?.endTime).format('HH:mm') : ''}
            </Typography>
          </Label>
        </TableCell>
        <TableCell align="left">
          <Label variant="soft" sx={{ textTransform: 'capitalize' }}>
            <Typography variant="subtitle2">
              {paymentDate ? moment.utc(paymentDate).format('DD-MM-YYYY') : ''}
            </Typography>
          </Label>
        </TableCell>
        <TableCell align="left">
          <Label variant="soft" sx={{ textTransform: 'capitalize' }}>
            <Typography variant="subtitle2">
              {' '}
              {paymentDate ? moment.utc(paymentDate).format('HH:mm') : ''}
            </Typography>
          </Label>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2">{orderId}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2">{billSummary?.payableAmt}</Typography>
        </TableCell>
        <TableCell align="left">
          <Label
            variant="soft"
            color={paymentStatus === 'pending' ? 'warning' : 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            <Typography variant="subtitle2">{paymentStatus}</Typography>
          </Label>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 250 }}
      >
        <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="carbon:view-filled" />
          View Details
        </MenuItem>

        <MenuItem
          disabled={paymentStatus === 'pending' || !modulePermit.edit}
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Change Doctor/Re-Schedule
        </MenuItem>
      </MenuPopover>
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogContent
          sx={{
            pt: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">Change Doctor/Re-Schedule</Typography>
          <IconButton onClick={handleCloseConfirm}>
            <Iconify icon="material-symbols:cancel" />
          </IconButton>
        </DialogContent>
        <DialogContent>
          <ChangeDocForm id={row?._id} currentDoc={row} onSuccess={handleCloseConfirm} />
        </DialogContent>
      </Dialog>
    </>
  );
}
