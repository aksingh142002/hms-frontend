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
import ExtendExpiryForm from './ExtendExpiryForm';

// ----------------------------------------------------------------------

PlanTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onOtherDetailsView: PropTypes.func,
  onViewRow: PropTypes.func,
  onAssignDoctor: PropTypes.func,
  onAssignNutritionist: PropTypes.func,
  query: PropTypes.object,
  index: PropTypes.number,
  modulePermit: PropTypes.object,
};

export default function PlanTableRow({
  row,
  selected,
  onOtherDetailsView,
  onViewRow,
  onAssignDoctor,
  onAssignNutritionist,
  query,
  index,
  modulePermit,
}) {
  const {
    patientName,
    patientNo,
    planId,
    assignDoctor,
    assignNutritionist,
    serviceId,
    orderId,
    timeSlot,
    billSummary,
    paymentStatus,
    paymentDate,
    expiredplanDate,
    createdBy,
    createdAt,
  } = row;
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
          <Typography variant="subtitle2">{createdBy?.name}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2">{createdBy?.mobile}</Typography>
        </TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={assignDoctor ? 'success' : 'error'}
            sx={{ textTransform: 'capitalize' }}
          >
            <Typography variant="subtitle2">{assignDoctor?.name ?? 'Not assigned'}</Typography>
          </Label>
        </TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={assignNutritionist ? 'success' : 'error'}
            sx={{ textTransform: 'capitalize' }}
          >
            <Typography variant="subtitle2">{assignNutritionist?.name ?? 'Not assigned'}</Typography>
          </Label>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle2">{planId?.title}</Typography>
        </TableCell>
        <TableCell align="left">
          <Label variant="soft" sx={{ textTransform: 'capitalize' }}>
            <Typography variant="subtitle2">
              {' '}
              {paymentDate ? moment.utc(paymentDate).format('DD-MM-YYYY') : ''}
            </Typography>
          </Label>
        </TableCell>
        <TableCell align="left">
          <Label variant="soft" sx={{ textTransform: 'capitalize' }}>
            <Typography variant="subtitle2">
              {paymentDate ? moment.utc(paymentDate).format('HH:mm') : ''}
            </Typography>
          </Label>
        </TableCell>
        <TableCell align="left">
          <Label variant="soft" sx={{ textTransform: 'capitalize' }}>
            <Typography variant="subtitle2">
              {expiredplanDate && paymentStatus !== 'pending' ? moment.utc(expiredplanDate).format('DD-MM-YYYY') : 'N/A'}
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
        sx={{ width: 200 }}
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
          disabled={paymentStatus === 'pending'}
          onClick={() =>
          {
            onOtherDetailsView();
            handleClosePopover();
          }}
        >
          <Iconify icon="icon-park-solid:other" />
          Other Details
        </MenuItem>
        <MenuItem
          disabled={paymentStatus === 'pending' || !modulePermit.edit}
          onClick={() => {
            onAssignDoctor();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          {assignDoctor?.name ? "Change Doctor" : "Assign Doctor"}
        </MenuItem>

        <MenuItem
          disabled={paymentStatus === 'pending' || !modulePermit.edit}
          onClick={() => {
            onAssignNutritionist();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          {assignNutritionist?.name ? "Change Nutritionist" : "Assign Nutritionist"}
        </MenuItem>
        <MenuItem
          disabled={paymentStatus === 'pending' || !modulePermit.edit}
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
        >
          <Iconify icon="streamline:calendar-jump-to-date-solid" />
          Extend Expiry
        </MenuItem>
      </MenuPopover>
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogContent sx={{ pt: '15px', display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5">Expiry Date</Typography>
          <IconButton onClick={handleCloseConfirm}>
            <Iconify icon="material-symbols:cancel" />
          </IconButton>
        </DialogContent>
        <DialogContent>
          <ExtendExpiryForm
            id={row?._id}
            currentExpiry={expiredplanDate}
            onSuccess={handleCloseConfirm}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
